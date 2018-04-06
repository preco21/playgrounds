/* eslint-disable no-console */

const {join} = require('path');
const tempy = require('tempy');
const {copy} = require('fs-extra');
const writePkg = require('write-pkg');
const execa = require('execa');
const electronBuilder = require('electron-builder');
const packageJSON = require('../package.json');

const {
  app: {
    destPath,
    externals = [],
    files = [],
    build = {},
  } = {},
} = packageJSON;

const whitelist = [
  'name',
  'productName',
  'version',
  'description',
  'author',
  'private',
  'main',
  'dependencies',
];

const tempDir = tempy.directory();

Promise.resolve()
  .then(copyDestFiles)
  .then(processPackageJSON)
  .then(installDependencies)
  .then(buildApp)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

function pick(obj, filter) {
  return Object.entries(obj)
    .filter(([key]) => filter.includes(key))
    .reduce((res, [key, value]) => ({
      ...res,
      [key]: value,
    }), {});
}

function getInstallCommand() {
  return execa('yarn', ['--version'])
    .then(({stdout}) => stdout && stdout.toString().trim())
    .then((isYarnAvailable) => isYarnAvailable
      ? ['yarn', ['install', '--no-bin-links']]
      : ['npm', ['install']]);
}

function copyDestFiles() {
  console.log('> Copying destination files...');

  return Promise.all([destPath, ...files].map((target) => copy(target, join(tempDir, target))));
}

function processPackageJSON() {
  console.log('> Processing package.json...');

  const {dependencies, ...rest} = pick(packageJSON, whitelist);
  const withExternals = {
    ...rest,
    dependencies: dependencies && pick(dependencies, externals),
  };

  return writePkg(tempDir, withExternals);
}

function installDependencies() {
  console.log('> Installing production dependencies...');

  return getInstallCommand().then((command) =>
    execa(...command, {
      cwd: tempDir,
      stdout: process.stdout,
    }));
}

function buildApp() {
  console.log('> Building application...');

  return electronBuilder.build({
    config: {
      ...build,
      asar: false,
      directories: {
        ...build.directories,
        app: tempDir,
      },
    },
  });
}
