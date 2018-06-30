import {app, protocol} from 'electron';
import {createServer} from 'http';
import {join, parse} from 'path';

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

export function renderStatic(destPath) {
  return new Promise((resolve, reject) => {
    const paths = ['_next', 'static'];
    protocol.interceptFileProtocol('file', (request, cb) => {
      const targetPath = request.url.slice(process.platform === 'win32' ? 8 : 7);
      const normalizedPath = targetPath.replace(new RegExp(`${parse(targetPath).root}`), '/');

      const finalPath = paths.some((path) => normalizedPath.startsWith(`/${path}`)) ? join(destPath, normalizedPath) : targetPath;
      cb({path: decodeURIComponent(finalPath)});
    }, (error) => error
      ? reject(error)
      : resolve(`file://${join(destPath, 'index.html')}`));
  });
}

export default function prepareRenderer({
  dev = false,
  sourcePath,
  destPath,
  port,
}) {
  return dev ? devServer(sourcePath, port) : renderStatic(destPath);
}
