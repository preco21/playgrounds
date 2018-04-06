import {resolve} from 'path';
import {
  app,
  dialog,
  BrowserWindow,
} from 'electron';
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

// Handle debug mode
if (dev) {
  const electronDebug = require('electron-debug');
  const {install: installDevtron} = require('devtron');

  electronDebug();
  installDevtron();
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
    // Install devtools extensions
    if (dev) {
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

    const entry = dev
      ? 'http://localhost:3000'
      : `file://${resolve(app.getAppPath(), process.env.RENDERER_PREFIX, 'index.html')}`;

    win.loadURL(entry);
  } catch (err) {
    dialog.showErrorBox('Error', err.message);
    process.exit(1);
  }
});
