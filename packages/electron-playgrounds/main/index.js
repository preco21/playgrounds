import './ipc';
import {app, dialog, BrowserWindow} from 'electron';
import {installDevSuiteIfNeeded} from './internals/utils';
import prepareRenderer from './internals/renderer';
import {
  isDev,
  preloadScript,
} from './internals/constants';

let win = null;

// Handle single instance
const shouldLockSingleInstance = app.requestSingleInstanceLock();
if (shouldLockSingleInstance) {
  app.on('second-instance', () => {
    if (!win) {
      return;
    }

    if (win.isMinimized()) {
      win.restore();
    }

    win.focus();
  });
} else {
  app.quit();
}

// Handle quit events
app.on('window-all-closed', () => app.quit());

// Application entry
app.on('ready', async () => {
  try {
    await installDevSuiteIfNeeded();

    // Instantiate browser window
    win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      title: 'Electron Playgrounds',
      show: false,
      autoHideMenuBar: true,
      backgroundColor: '#F1F5F7',
      acceptFirstMouse: true,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: false,
        preload: preloadScript,
        nodeIntegration: false,
        webviewTag: false,
      },
    });

    // Show the window immediately in dev mode
    if (isDev) {
      win.showInactive();
    } else {
      win.once('ready-to-show', () => win.show());
    }

    win.once('closed', () => (win = null));

    const entry = await prepareRenderer();

    win.loadURL(entry);
  } catch (err) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      dialog.showErrorBox('Error', err.stack);
    }

    app.exit(1);
  }
});
