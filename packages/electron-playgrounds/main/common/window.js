import {preloadScript, isDev} from '../internals/constants';

export const defaultWindowOptions = {
  show: false,
  autoHideMenuBar: true,
  backgroundColor: '#F1F5F7',
  acceptFirstMouse: true,
  webPreferences: {
    contextIsolation: false,
    // FIXME: When disabled, it shows untraceable errors.
    enableRemoteModule: true,
    preload: preloadScript,
    nodeIntegration: false,
    webviewTag: false,
  },
};

export function showWhenReady(win) {
  if (isDev) {
    win.showInactive();
  } else {
    win.once('ready-to-show', () => win.show());
  }
}
