import {resolve} from 'path';
import {
  app,
  dialog,
  BrowserWindow,
} from 'electron';
import isElectronDev from 'electron-is-dev';
import prepareRenderer from 'electron-next';
import {checkIfTampered, installDevExtensions} from './main/utils';

const isDev = process.env.NODE_ENV === 'development';
const devPort = 3000;

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

    await prepareRenderer({
      development: 'src',
      production: __RENDERER_PREFIX__,
    }, devPort);

    // Instantiate browser window
    win = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      title: 'Yey!',
      show: false,
      autoHideMenuBar: true,
      backgroundColor: '#fff',
    });

    win.on('ready-to-show', () => win.show());
    win.on('closed', () => (win = null));

    win.loadURL(resolveEntry());
  } catch (err) {
    dialog.showErrorBox('Error', err.stack);
    process.exit(1);
  }
});

function resolveEntry() {
  // Dev mode ran by package manager
  if (isDev) {
    return `http://localhost:${devPort}`;
  }

  // Normalize app path where can be a local mode or a production
  const appropriateAppPath = isElectronDev ? process.cwd() : app.getAppPath();
  return `file://${resolve(appropriateAppPath, __RENDERER_PREFIX__, 'index.html')}`;
}
