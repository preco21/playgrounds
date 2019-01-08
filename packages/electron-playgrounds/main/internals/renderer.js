import {join} from 'path';
import {resolvePathFromURI, registerFileProtocol} from './protocol';
import {isDev, rendererContent} from './constants';

export async function renderStatic(destPath, routeName) {
  await registerFileProtocol('next', (request, cb) => {
    const actualPath = resolvePathFromURI(request.url, 'next');
    const finalPath = join(destPath, actualPath);
    cb(finalPath);
  });

  return `file://${join(destPath, routeName, 'index.html')}`;
}

export function renderDevelopment(host, port, routeName) {
  return `http://${host}:${port}/${routeName}`;
}

export async function loadRoute(win, routeName, {
  devServerHost = 'localhost',
  devServerPort = 3000,
  staticRendererPath = rendererContent,
  openDevToolsInDevMode = true,
} = {}) {
  const entry = await (isDev
    ? renderDevelopment(devServerHost, devServerPort, routeName)
    : renderStatic(staticRendererPath, routeName));

  win.loadURL(entry);

  if (openDevToolsInDevMode && isDev) {
    win.openDevTools({mode: 'detach'});
  }
}
