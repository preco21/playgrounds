import nanoid from 'nanoid';
import serializeError from 'serialize-error';

function deserializeError(error) {
  const {message, ...rest} = error;
  // eslint-disable-next-line no-restricted-properties
  return Object.assign(new Error(error.message), rest);
}

export class PromsieIPC {
  constructor(ipc, {
    resolveChannelName = (type) => `@ipc__${type}`,
    onIPCError = (err) => console.error('IPC Error: ', err),
  } = {}) {
    this.ipc = ipc;
    this.channelNameRequest = resolveChannelName('request');
    this.channelNameResponse = resolveChannelName('response');
    this.listeners = new Map();
    this.responseMap = new Map();
    this.onIPCError = onIPCError;

    // Request handler
    this.ipc.on(this.channelNameRequest, async (event, name, uuid, ...eventArgs) => {
      try {
        if (!this.listeners.has(name)) {
          throw new Error(`No such event found: ${name}`);
        }

        const handler = this.listeners.get(name);
        const payload = await handler(...eventArgs);

        event.sender.send(this.channelNameResponse, uuid, null, payload);
      } catch (err) {
        event.sender.send(this.channelNameResponse, uuid, serializeError(err));
        this.onIPCError(err);
      }
    });

    // Response handler
    this.ipc.on(this.channelNameResponse, (event, uuid, error, payload) => {
      if (this.responseMap.has(uuid)) {
        const [resolve, reject] = this.responseMap.get(uuid);

        if (error) {
          reject(deserializeError(error));
        } else {
          resolve(payload);
        }

        this.responseMap.delete(uuid);
      }
    });
  }

  on(name, handle) {
    this.listeners.set(name, handle);
  }

  send(name, ...args) {
    return new Promise((resolve, reject) => {
      const uuid = nanoid();
      this.responseMap.set(uuid, [resolve, reject]);
      this.ipc.send(this.channelNameRequest, name, uuid, ...args);
    });
  }
}

export function createPromiseIPC(ipc) {
  return new PromsieIPC(ipc);
}

export function checkIfTampered() {
  const forbiddenEnvs = [
    'ELECTRON_ENABLE_LOGGING',
    'ELECTRON_LOG_ASAR_READS',
    'ELECTRON_ENABLE_STACK_DUMPING',
  ];

  const forbiddenArgs = [
    '--auth-negotiate-delegate-whitelist',
    '--auth-server-whitelist',
    '--disable-renderer-backgrounding',
    '--enable-logging',
    '--host-resolver-rules',
    '--host-rules',
    '--inspect-brk',
    '--inspect',
    '--js-flags',
    '--log-net-log',
    '--no-proxy-server',
    '--ppapi-flash-path',
    '--ppapi-flash-version',
    '--proxy-bypass-list',
    '--proxy-pac-url',
    '--proxy-server',
    '--remote-debugging-address',
    '--remote-debugging-port',
    '--remote-debugging-socket-fd',
    '--remote-debugging-socket-name',
    '--remote-debugging-targets',
    '--user-data-dir',
    '--v',
    '--vmodule',
  ];

  const {env: envs} = process;
  const args = process.argv.slice(1);

  const tamperedEnvs = forbiddenEnvs.filter((env) => envs[env] !== undefined);
  const tamperedArgs = forbiddenArgs.filter((forbiddenArg) => args.some((arg) => forbiddenArg === arg));

  const isValid = tamperedEnvs.length < 1 && tamperedArgs.length < 1;

  return {
    valid: isValid,
    tamperedEnvs,
    tamperedArgs,
  };
}

export async function installDevSuite() {
  installElectronDebug();
  await installDevExtensions([
    'REACT_DEVELOPER_TOOLS',
  ]);
}

export function installElectronDebug() {
  const electronDebug = require('electron-debug');
  electronDebug();
}

export function installDevExtensions(extentions) {
  const {default: installExtension, ...devtools} = require('electron-devtools-installer');
  return Promise.all(extentions.map((name) => installExtension(devtools[name])));
}
