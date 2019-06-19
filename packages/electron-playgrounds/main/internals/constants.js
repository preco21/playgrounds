import { resolve } from 'path'
import { app } from 'electron'
import isElectronDev from 'electron-is-dev'

export const isDev = process.env.NODE_ENV === 'development'
export const resourceBase = isElectronDev
  ? process.cwd()
  : process.resourcesPath
export const appBase = isElectronDev ? process.cwd() : app.getAppPath()

export const appContent = resolve(appBase, '.out')
export const staticContent = resolve(appBase, 'static')
export const rendererContent = resolve(appContent, 'renderer')

export const preloadScript = resolve(appContent, 'preload.js')
