import {app} from 'electron';
import unhandled from 'electron-unhandled';
import {isDev} from './internals/constants';
import {initializeDevSuite} from './common/debug';
import {initializeMainIPC, openMainWindow} from './frames/main';

unhandled({showDialog: !isDev});

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.exit();
}

app.on('window-all-closed', () => app.quit());

(async () => {
  await app.whenReady();
  await initializeDevSuite();

  await initializeMainIPC();
  await openMainWindow();
})();
