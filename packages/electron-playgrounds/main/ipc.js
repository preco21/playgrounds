import {ipcMain as _ipc} from 'electron';
import {createPromiseIPC} from './internals/utils';

const ipc = createPromiseIPC(_ipc);

ipc.on('ping', () => Promise.resolve('PONG from main process'));
