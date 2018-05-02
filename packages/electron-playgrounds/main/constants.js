import {resolve} from 'path';
import {app} from 'electron';
import isElectronDev from 'electron-is-dev';

export const appDest = 'app';
export const rendererSource = 'src';
export const rendererTarget = 'renderer';

export const isDev = process.env.NODE_ENV === 'development';
export const appBase = isElectronDev ? process.cwd() : app.getAppPath();
export const appContent = resolve(appBase, appDest);
export const preloadScript = resolve(appContent, 'preload.js');

export const devServerPort = 3000;

export function resolveEntry() {
  if (isDev) {
    return `http://localhost:${devServerPort}`;
  }

  return `file://${resolve(appContent, rendererTarget, 'index.html')}`;
}
