import {ipcRenderer as ipc} from 'electron';

// Expose `ipc` modules
window.ipc = ipc;

// Disable `eval`
// eslint-disable-next-line no-eval
window.eval = null;
