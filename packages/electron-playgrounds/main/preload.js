import {ipcRenderer as _ipc} from 'electron';
import {createPromiseIPC} from './internals/utils';

// Expose `ipc` modules
window.ipc = createPromiseIPC(_ipc);

// Disable `eval`
// eslint-disable-next-line no-eval
window.eval = null;
