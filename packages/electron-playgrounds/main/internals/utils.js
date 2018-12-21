import nanoid from 'nanoid';
import {isDev} from './constants';

export function serializeError(obj, seen = [obj]) {
  return [...Object.keys(obj), 'name', 'message', 'stack', 'code']
    .reduce((res, key) => {
      // eslint-disable-next-line prefer-destructuring
      const value = obj[key];

      if (typeof value === 'function') {
        return res;
      }

      if (value && typeof value === 'object') {
        return {
          ...res,
          [key]: seen.includes(value)
            ? '[Circular]'
            : serializeError(value, [...seen, value]),
        };
      }

      return {
        ...res,
        [key]: value,
      };
    }, {});
}

export function deserializeError(error) {
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

const passThroughProxyMethods = ['on', 'send'];
export function createPromiseIPCProxy(ipc) {
  const promiseIPC = new PromiseIPC(ipc);
  return new Proxy(promiseIPC, {
    get(object, key) {
      if (passThroughProxyMethods.includes(key)) {
        return (...args) => object[key](...args);
      }

      return (...args) => object.send(key, ...args);
    },
  });
}

export async function installDevSuiteIfNeeded() {
  if (isDev) {
    installElectronDebug();
    await installDevExtensions([
      'REACT_DEVELOPER_TOOLS',
    ]);
  }
}

export function installElectronDebug() {
  const electronDebug = require('electron-debug');
  electronDebug();
}

export function installDevExtensions(extentions) {
  const {default: installExtension, ...devtools} = require('electron-devtools-installer');
  return Promise.all(extentions.map((name) => installExtension(devtools[name])));
}
