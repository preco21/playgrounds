import {
  app,
  dialog,
  BrowserWindow,
} from 'electron';
import prepareRenderer from 'electron-next';
import {
  rendererSource,
  rendererTarget,
  isDev,
  preloadScript,
  devServerPort,
  resolveEntry,
} from './constants';
import {checkIfTampered, installDevExtensions} from './utils';

let win = null;

// Handle single instance
if (app.makeSingleInstance(() => {
  if (!win) {
    return;
  }

  if (win.isMinimized()) {
    win.restore();
  }

  if (win.isVisible()) {
    win.focus();
  } else {
    win.show();
  }
})) {
  process.exit(1);
}

// Quit immediately if there are forbidden stuff
const tampered = checkIfTampered();
if (!isDev && !tampered.valid) {
  // eslint-disable-next-line no-console
  console.error(`
  You have forbidden envs or args :p
    Envs: ${tampered.tamperedEnvs.join() || 'None'}
    Args: ${tampered.tamperedArgs.join() || 'None'}
`);

  process.exit(1);
}

// Handle quit events
app.on('window-all-closed', () => app.quit());

// Application entry
app.on('ready', async () => {
  try {
    if (isDev) {
      const electronDebug = require('electron-debug');
      electronDebug();

      const {install: installDevtron} = require('devtron');
      installDevtron();

      await installDevExtensions([
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS',
      ]);
    }

    process.env.BABEL_ENV = isDev ? 'renderer-development' : 'renderer-production';
    await prepareRenderer({
      development: rendererSource,
      production: rendererTarget,
    }, devServerPort);

    // Instantiate browser window
    win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      title: 'Electron Playgrounds',
      show: isDev,
      autoHideMenuBar: true,
      backgroundColor: '#F1F5F7',
      acceptFirstMouse: true,
      webPreferences: {
        nodeIntegration: false,
        preload: preloadScript,
        webviewTag: false,
      },
    });

    win.on('ready-to-show', () => win.show());
    win.on('closed', () => (win = null));

    win.loadURL(resolveEntry());
  } catch (err) {
    dialog.showErrorBox('Error', err.stack);
    process.exit(1);
  }
});
