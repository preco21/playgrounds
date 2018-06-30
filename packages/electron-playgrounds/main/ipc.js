import {ipcMain as _ipc} from 'electron';
import {createPromiseIPC} from './utils';

const ipc = createPromiseIPC(_ipc);

ipc.on('ping', () => Promise.resolve('PONG from main process'));
