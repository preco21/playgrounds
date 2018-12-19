import {protocol} from 'electron';
import {join} from 'path';
import {parse} from 'url';
import {directory} from 'tempy';

const tempDirs = new Map();

export function getTemporaryDirectory(key) {
  if (!tempDirs.has(key)) {
    tempDirs.set(key, directory());
  }

  return tempDirs.get(key);
}

export function createRegisterXProtocol(funcName) {
  return (name, handle) => new Promise((resolve, reject) => protocol[funcName](
    name,
    handle,
    (error) => error ? reject(error) : resolve(),
  ));
}

export const registerFileProtocol = createRegisterXProtocol('registerFileProtocol');
export const interceptFileProtocol = createRegisterXProtocol('interceptFileProtocol');

// Slice down up until the place where the actual path starts.
// That omits few more characters for Windows due to the root of the url starts with drive letter (C:/).
// After the processing, you will get normalized path: /filename.txt
export function parseActualPathFromURI(uri, omitDeviceLetter = false) {
  return decodeURIComponent(uri)
    .slice(process.platform === 'win32' ? 8 + (omitDeviceLetter ? 2 : 0) : 7);
}

export function addFileProtocol(name, basePath) {
  return registerFileProtocol(name, (request, cb) => {
    const normalPath = parseActualPathFromURI(request.url, true);
    const filePath = join(basePath, normalPath);

    cb(filePath);
  });
}

export function addTempProtocol(name = 'temp') {
  return registerFileProtocol(name, (request, cb) => {
    const normalPath = parseActualPathFromURI(request.url, true);
    const tempPath = getTemporaryDirectory(name);
    const targetPath = join(tempPath, normalPath);

    cb(targetPath);
  });
}
