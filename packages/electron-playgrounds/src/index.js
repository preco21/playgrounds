import {resolve} from 'path';
import {
  app,
  dialog,
  BrowserWindow,
} from 'electron';
import isDev from 'electron-is-dev';
import {hasForbiddenEnvsOrArgs, installDevExtensions} from './utils/main';

const dev = process.env.NODE_ENV === 'development';

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
if (!dev && hasForbiddenEnvsOrArgs()) {
  // eslint-disable-next-line no-console
  console.error('You got forbidden envs or args :p');
  process.exit(1);
}

// Handle quit events
app.on('window-all-closed', () => app.quit());

// Application entry
app.on('ready', async () => {
  try {
    // Handle devtools
    if (dev) {
      const electronDebug = require('electron-debug');
      electronDebug();

      const {install: installDevtron} = require('devtron');
      installDevtron();

      await installDevExtensions([
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS',
      ]);
    }

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
    dialog.showErrorBox('Error', err.message);
    process.exit(1);
  }
});

function resolveEntry() {
  // Dev mode ran by package manager
  if (dev) {
    return 'http://localhost:3000';
  }

  // Normalize app path where can be a local mode or a production
  const appropriateAppPath = isDev ? process.cwd() : app.getAppPath();
  return `file://${resolve(appropriateAppPath, process.env.RENDERER_PREFIX, 'index.html')}`;
}
