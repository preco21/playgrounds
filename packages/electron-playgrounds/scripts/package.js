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
    appDest,
    externals = [],
    files = [],
  } = {},
  build = {},
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

(async () => {
  try {
    await copyDestFiles();
    await processPackageJSON();
    await installDependencies();
    await buildApp();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

function pick(obj, filter) {
  return Object.entries(obj)
    .filter(([key]) => filter.includes(key))
    .reduce((res, [key, value]) => ({
      ...res,
      [key]: value,
    }), {});
}

async function getInstallCommand() {
  try {
    const {stdout} = await execa('yarn', ['--version']);
    if (stdout && Boolean(stdout.toString().trim())) {
      throw new Error('No yarn output');
    }

    return ['yarn', ['install', '--no-bin-links', '--no-lockfile']];
  } catch (err) {
    return ['npm', ['install', '--no-bin-links', '--no-package-lock']];
  }
}

function copyDestFiles() {
  console.log('> Copying files to destination...');

  return Promise.all([appDest, ...files].map((target) => copy(target, join(tempDir, target))));
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

async function installDependencies() {
  console.log('> Installing production dependencies...');

  const installCommand = await getInstallCommand();
  return execa(...installCommand, {
    cwd: tempDir,
    stdout: process.stdout,
  });
}

function buildApp() {
  console.log('> Building application...');

  return electronBuilder.build({
    config: {
      ...build,
      directories: {
        ...build.directories,
        app: tempDir,
      },
    },
  });
}
