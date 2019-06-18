import { app, BrowserWindow } from 'electron'
import { loadRoute } from '../internals/renderer'
import ipc from '../common/ipc'
import { defaultWindowOptions, showWhenReady } from '../common/window'

let mainWindow = null

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close')
  }
})

export function initializeMainIPC() {
  ipc.on('ping', () => Promise.resolve('PONG'))
}

export async function openMainWindow() {
  if (mainWindow) {
    mainWindow.show()
    return
  }

  mainWindow = new BrowserWindow({
    ...defaultWindowOptions,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    maximizable: false,
    fullscreenable: false,
    title: 'Electron Playgrounds',
  })

  showWhenReady(mainWindow)

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.minimize()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  await loadRoute(mainWindow, 'main')
}
