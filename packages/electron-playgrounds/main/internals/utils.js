import nanoid from 'nanoid';
import serializeError from 'serialize-error';

function deserializeError(error) {
  const {message, ...rest} = error;
  // eslint-disable-next-line no-restricted-properties
  return Object.assign(new Error(error.message), rest);
}

export class PromiseIPC {
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
  return new PromiseIPC(ipc);
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
