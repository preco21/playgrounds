import {app} from 'electron';
import {join} from 'path';
import {createServer} from 'http';
import {parseActualPathFromURI, interceptFileProtocol} from './protocol';

export async function devServer(dir, port) {
  // Define `BABEL_ENV` for babel config directly used by `next`
  process.env.BABEL_ENV = 'renderer-development';

  const next = require('next');
  const nextApp = next({dev: true, dir});
  await nextApp.prepare();

  const server = createServer(nextApp.getRequestHandler());
  server.listen(port, () => app.on('before-quit', () => server.close()));

  return `http://localhost:${port}`;
}

const allowedPaths = ['/_next', '/static'];
export async function renderStatic(destPath) {
  await interceptFileProtocol('file', (request, cb) => {
    const actualPath = parseActualPathFromURI(request.url);
    const normalizedPath = process.platform === 'win32' ? actualPath.slice(2) : actualPath;
    const finalPath = allowedPaths.some((path) => normalizedPath.startsWith(path))
      ? join(destPath, normalizedPath)
      : actualPath;

    cb(finalPath);
  });

  return `file://${join(destPath, 'index.html')}`;
}

export default function prepareRenderer({
  dev = false,
  sourcePath,
  destPath,
  port,
}) {
  return dev ? devServer(sourcePath, port) : renderStatic(destPath);
}
