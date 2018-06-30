import './ipc';
import {app, dialog, BrowserWindow} from 'electron';
import {checkIfTampered, installDevSuite} from './utils';
import prepareRenderer from './renderer';
import {
  isDev,
  preloadScript,
  rendererSourceDir,
  rendererContentDir,
  devServerPort,
} from './constants';

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

// Quit immediately if forbidden behavior is detected (just simple security)
const tampered = checkIfTampered();
if (!isDev && !tampered.valid) {
  // eslint-disable-next-line no-console
  console.error(`
  You have passed forbidden extra arguments. Please check if you are passing valid arguments.
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
      await installDevSuite();
    }

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
        preload: preloadScript,
        nodeIntegration: false,
        webviewTag: false,
      },
    });

    win.on('ready-to-show', () => win.show());
    win.on('closed', () => (win = null));

    const entry = await prepareRenderer({
      dev: isDev,
      sourcePath: rendererSourceDir,
      destPath: rendererContentDir,
      port: devServerPort,
    });

    win.loadURL(entry);
  } catch (err) {
    dialog.showErrorBox('Error', err.stack);
    process.exit(1);
  }
});
