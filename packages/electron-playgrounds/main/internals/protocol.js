import {protocol} from 'electron';
import {join} from 'path';
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

export function resolvePathFromURI(uri, protocolName = 'file') {
  return decodeURIComponent(uri).slice(protocolName.length + 3);
}

// Slice down up until the place where the absolute path starts.
// This helper method omits few more characters for Windows due to the root of the url starts with drive letter (C:/).
// After the processing, you will get normalized path: /filename.txt
export function resolveActualPathFromURI(uri, {
  protocolName = 'file',
  omitDeviceLetter = false,
} = {}) {
  const rawPath = resolvePathFromURI(uri, protocolName);
  const startWithLength = process.platform === 'win32'
    ? 1 + (omitDeviceLetter ? 2 : 0)
    : 0;

  return rawPath.slice(startWithLength);
}

export function addFileProtocol(name, basePath) {
  return registerFileProtocol(name, (request, cb) => {
    const normalPath = resolvePathFromURI(request.url, name);
    const filePath = join(basePath, normalPath);

    cb(filePath);
  });
}

export function addTempProtocol(name = 'temp') {
  return registerFileProtocol(name, (request, cb) => {
    const normalPath = resolvePathFromURI(request.url, name);
    const tempPath = getTemporaryDirectory(name);
    const targetPath = join(tempPath, normalPath);

    cb(targetPath);
  });
}
