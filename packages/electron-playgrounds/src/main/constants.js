import {resolve} from 'path';
import {app} from 'electron';
import isElectronDev from 'electron-is-dev';

export const srcPath = 'src';
export const destPath = 'app';
export const rendererPath = 'renderer';

export const isDev = process.env.NODE_ENV === 'development';
export const appPath = isElectronDev ? process.cwd() : app.getAppPath();
export const appContentPath = resolve(appPath, destPath);
export const preloadPath = resolve(appContentPath, 'preload.js');

export const devServerPort = 3000;

export function resolveEntry() {
  if (isDev) {
    return `http://localhost:${devServerPort}`;
  }

  return `file://${resolve(appContentPath, rendererPath, 'index.html')}`;
}
