/* eslint-disable no-console */
const tempy = require('tempy')
const cpy = require('cpy')
const writePkg = require('write-pkg')
const npmPacklist = require('npm-packlist')
const electronBuilder = require('electron-builder')
const packageJSON = require('../package.json')

const {
  dependencies = {},
  bundledDependencies = [],
  build = {},
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
  ...restPackageJSON
} = packageJSON

const appDest = 'build'
const tempDir = tempy.directory()

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
  const deps = pick(dependencies, bundledDependencies)
  return {
    ...rebuiltPackageJSON,
    dependencies: deps,
  }
}

async function copyDestFiles() {
  console.log('> Copying resources to destination...')
  const packageFileList = await npmPacklist({ path: process.cwd() })
  await cpy([appDest, ...packageFileList, ...resources], tempDir, {
    parents: true,
  })
}

async function processPackageJSON() {
  console.log('> Processing package.json...')
  await writePkg(tempDir, rebuildPackageJSON())
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
    await copyDestFiles()
    await processPackageJSON()
    await buildApp()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
