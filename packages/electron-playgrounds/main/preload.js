import {ipcRenderer as ipc} from 'electron';

// Expose `ipc` modules.
window.ipc = ipc;

// Disable `eval`.
// eslint-disable-next-line no-eval
window.eval = null;

// Expose `require` and `process` for `devtron` only in dev mode.
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle, no-undef
  window.__devtron = {require: __non_webpack_require__, process};
}
