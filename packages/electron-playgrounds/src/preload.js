import {ipcRenderer as ipc} from 'electron';

// Expose `ipc` modules
window.ipc = ipc;

// Disable `eval`
// eslint-disable-next-line no-eval
window.eval = null;

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  window.__devtron = {require: window.require, process};
}
