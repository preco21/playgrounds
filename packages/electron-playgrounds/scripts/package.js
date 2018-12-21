/* eslint-disable no-console */
const {join} = require('path');
const {promises: {readFile}} = require('fs');
const tempy = require('tempy');
const cpy = require('cpy');
const execa = require('execa');
const writePkg = require('write-pkg');
const electronBuilder = require('electron-builder');
const packageJSON = require('../package.json');

const {
  app: {
    appDest,
    resources = [],
    packagePropsWhitelist = [
      'name',
      'productName',
      'version',
      'description',
      'author',
      'private',
      'main',
      'dependencies',
    ],
  } = {},
  build = {},
} = packageJSON;

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
  console.log('> Copying resources to destination...');

  return cpy(
    [appDest, `!${join(appDest, 'stats.json')}`, ...resources],
    tempDir,
    {parents: true},
  );
}

async function getAllRequiredModules() {
  const raw = await readFile(join(appDest, 'stats.json'));
  const stats = JSON.parse(raw);

  return stats.modules
    .map((entry) => entry.identifier)
    .filter((identifier) => identifier.startsWith('external'))
    .map((final) => /^external\s"(.+)"/.exec(final)[1]);
}

async function getMinimalDependenciesToInclude(deps) {
  const requiredModules = await getAllRequiredModules();
  return pick(deps, requiredModules);
}

async function processPackageJSON() {
  console.log('> Processing package.json...');

  const {dependencies = {}, ...rest} = pick(packageJSON, packagePropsWhitelist);
  const externals = await getMinimalDependenciesToInclude(dependencies);
  const withExternals = {
    ...rest,
    dependencies: externals,
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
      asar: !process.env.DISABLE_ASAR,
    },
  });
}
