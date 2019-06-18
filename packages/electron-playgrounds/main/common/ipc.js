import { ipcMain as _ipc } from 'electron'
import { createPromiseIPCProxy } from '../internals/ipc'

export default createPromiseIPCProxy(_ipc)
