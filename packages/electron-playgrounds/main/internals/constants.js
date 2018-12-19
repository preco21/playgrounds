import {resolve} from 'path';
import {app} from 'electron';
import isElectronDev from 'electron-is-dev';

export const appDest = '.app';
export const rendererSource = 'src';
export const rendererTarget = 'renderer';

export const isDev = process.env.NODE_ENV === 'development';
export const resourceBase = isElectronDev ? process.cwd() : process.resourcesPath;
export const appBase = isElectronDev ? process.cwd() : app.getAppPath();
export const appContent = resolve(appBase, appDest);

export const preloadScript = resolve(appContent, 'preload.js');

export const rendererSourcePath = resolve(appBase, rendererSource);
export const rendererContentPath = resolve(appContent, rendererTarget);

export const devServerPort = 3000;

