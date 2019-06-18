import { isDev } from '../internals/constants'

export function installElectronDebug() {
  const electronDebug = require('electron-debug')
  electronDebug()
}

export function installDevExtensions(extentions) {
  const {
    default: installExtension,
    ...devtools
  } = require('electron-devtools-installer')
  return Promise.all(extentions.map((name) => installExtension(devtools[name])))
}

export async function initializeDevSuite() {
  if (isDev) {
    installElectronDebug()
    await installDevExtensions(['REACT_DEVELOPER_TOOLS'])
  }
}
