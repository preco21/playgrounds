/* eslint-disable no-console */
const tempy = require('tempy')
const cpy = require('cpy')
const execa = require('execa')
const writePkg = require('write-pkg')
const electronBuilder = require('electron-builder')
const packageJSON = require('../package.json')

const {
  dependencies = {},
  build = {},
  resources = [],
  externals = [],
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
  ...restPackageJSON
} = packageJSON

const appDest = '.out'

const tempDir = tempy.directory()
const dependenciesToExclude = Object.keys(dependencies).filter((name) =>
  externals.includes(name),
)

function pick(obj, filter) {
  return Object.entries(obj)
    .filter(([key]) => filter.includes(key))
    .reduce(
      (res, [key, value]) => ({
        ...res,
        [key]: value,
      }),
      {},
    )
}

function rebuildPackageJSON() {
  const rebuiltPackageJSON = pick(restPackageJSON, packagePropsWhitelist)
  const deps = pick(dependencies, dependenciesToExclude)
  return {
    ...rebuiltPackageJSON,
    dependencies: deps,
  }
}

async function copyDestFiles() {
  console.log('> Copying resources to destination...')
  await cpy([appDest, ...resources], tempDir, { parents: true })
}

async function processPackageJSON() {
  console.log('> Processing package.json...')
  await writePkg(tempDir, rebuildPackageJSON())
}

async function getInstallCommand() {
  try {
    const { stdout } = await execa('yarn', ['--version'])
    if (!stdout || !stdout.toString().trim()) {
      throw new Error('No yarn output detected')
    }

    return [
      'yarn',
      ['install', '--production', '--no-bin-links', '--no-lockfile'],
    ]
  } catch (err) {
    return [
      'npm',
      ['install', '--production', '--no-bin-links', '--no-package-lock'],
    ]
  }
}

async function installPackages() {
  console.log('> Installing dependencies...')

  const installCommand = await getInstallCommand()
  return execa(...installCommand, {
    cwd: tempDir,
    stdout: process.stdout,
  })
}

function buildApp() {
  console.log('> Building application...')

  return electronBuilder.build({
    config: {
      ...build,
      directories: {
        ...build.directories,
        app: tempDir,
      },
      asar: process.env.DISABLE_ASAR !== 'true',
    },
  })
}

;(async () => {
  try {
    console.log(tempDir)
    await copyDestFiles()
    await processPackageJSON()
    await installPackages()
    await buildApp()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
