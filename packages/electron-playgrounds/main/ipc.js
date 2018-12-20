import {ipcMain as _ipc} from 'electron';
import {createPromiseIPCProxy} from './internals/utils';

const ipc = createPromiseIPCProxy(_ipc);

ipc.on('ping', () => Promise.resolve('PONG from main process'));
