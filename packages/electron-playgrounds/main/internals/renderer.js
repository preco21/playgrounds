import {app} from 'electron';
import {join} from 'path';
import {createServer} from 'http';
import {resolvePathFromURI, registerFileProtocol} from './protocol';
import {isDev} from './constants';

export async function devServer(dir, port) {
  // Define `BABEL_ENV` for babel config directly used by `next`
  process.env.BABEL_ENV = 'renderer-development';

  const next = require('next');
  const nextApp = next({dev: true, dir});
  await nextApp.prepare();

  const server = createServer(nextApp.getRequestHandler());
  server.listen(port, () => app.on('before-quit', () => server.close()));

  return `http://localhost:${port}/`;
}

export async function renderStatic(destPath) {
  await registerFileProtocol('next', (request, cb) => {
    const actualPath = resolvePathFromURI(request.url, 'next');
    const finalPath = join(destPath, actualPath);
    cb(finalPath);
  });

  return `file://${join(destPath, 'index.html')}`;
}

export default function prepareRenderer({
  dev = isDev,
  sourcePath,
  destPath,
  port,
}) {
  return dev ? devServer(sourcePath, port) : renderStatic(destPath);
}
