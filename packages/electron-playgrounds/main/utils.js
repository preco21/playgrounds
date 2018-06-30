import nanoid from 'nanoid';
import serializeError from 'serialize-error';

export class PromsieIPC {
  constructor(ipc) {
    this.ipc = ipc;
  }

  on(eventName, handler) {
    this.ipc.on(eventName, async (event, uuid, ...eventArgs) => {
      try {
        const payload = await handler(...eventArgs);
        event.sender.send(eventName, uuid, null, payload);
      } catch (err) {
        event.sender.send(eventName, uuid, serializeError(err));
      }
    });
  }

  send(eventName, ...args) {
    return new Promise((resolve, reject) => {
      const uuid = nanoid();
      const listener = (event, eventUUID, error, payload) => {
        // Ignore any event that doesn't match to uuid
        if (eventUUID !== uuid) {
          return;
        }

        // Resolve or reject this promise
        if (error) {
          reject(deserializeError(error));
        } else {
          resolve(payload);
        }

        // Finally remove only this listener
        this.ipc.removeListener(eventName, listener);
      };

      this.ipc.on(eventName, listener);
      this.ipc.send(eventName, uuid, ...args);
    });
  }
}

export function deserializeError(errorObj) {
  const error = new Error();

  // eslint-disable-next-line no-restricted-properties
  return Object.assign(error, errorObj);
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
  installDevtron();
  await installDevExtensions([
    'REACT_DEVELOPER_TOOLS',
  ]);
}

export function installElectronDebug() {
  const electronDebug = require('electron-debug');
  electronDebug();
}

export function installDevtron() {
  const {install: _installDevtron} = require('devtron');
  _installDevtron();
}

export function installDevExtensions(extentions) {
  const {default: installExtension, ...devtools} = require('electron-devtools-installer');
  return Promise.all(extentions.map((name) => installExtension(devtools[name])));
}
