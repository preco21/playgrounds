import {join} from 'path';
import {resolvePathFromURI, registerFileProtocol} from './protocol';
import {isDev, devServerPort, rendererContentPath} from './constants';

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
  port = devServerPort,
  destPath = rendererContentPath,
} = {}) {
  return dev ? `http://localhost:${port}/` : renderStatic(destPath);
}
