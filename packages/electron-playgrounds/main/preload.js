import {ipcRenderer as _ipc} from 'electron';
import {createPromiseIPC} from './internals/utils';

// Expose `ipc` modules
window.ipc = createPromiseIPC(_ipc);

// Disable `eval` when production
if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line no-eval
  window.eval = null;
}
