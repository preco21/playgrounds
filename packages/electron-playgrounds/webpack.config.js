const { resolve } = require('path')
const { smart: webpackMergeSmart } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const WebpackBarPlugin = require('webpackbar')
const { bundledDependencies } = require('./package.json')

const mainSource = 'main'
const appDest = '.out'

function optional(arr = []) {
  return arr.filter(Boolean)
}

module.exports = (env = {}, argv = {}) => {
  const mode = env.mode || argv.mode
  const isDev = mode === 'development'

  const shouldSupportSourceMap = process.env.NO_SOURCE_MAP_SUPPORT !== 'true'
  const selectSourceMap = () =>
    isDev ? 'cheap-module-source-map' : 'nosources-source-map'

  const sharedConfig = {
    mode,
    devtool: shouldSupportSourceMap ? selectSourceMap() : undefined,
    output: {
      path: resolve(__dirname, appDest),
    },
    module: {
      rules: optional([
        {
          test: /\.js$/,
          include: resolve(__dirname, mainSource),
          loader: 'babel-loader',
          options: {
            envName: `main-${mode}`,
            cacheDirectory: isDev,
          },
        },
        !isDev && {
          test: /\.(js|mjs|node)$/,
          parser: { amd: false },
          loader: '@zeit/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'res',
          },
        },
      ]),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DotenvPlugin(),
      new WebpackBarPlugin(),
    ],
    externals: bundledDependencies.reduce(
      (res, name) => ({
        ...res,
        [name]: `commonjs ${name}`,
      }),
      {},
    ),
    node: {
      __dirname: false,
      __filename: false,
    },
    optimization: {
      minimize: false,
    },
    performance: {
      hints: false,
    },
    stats: 'errors-only',
  }

  return [
    webpackMergeSmart(
      {
        target: 'electron-main',
        entry: optional([
          shouldSupportSourceMap &&
            `./${mainSource}/common/source-map-support.js`,
          `./${mainSource}/index.js`,
        ]),
        output: {
          filename: 'index.js',
        },
      },
      sharedConfig,
    ),
    webpackMergeSmart(
      {
        target: 'electron-renderer',
        entry: optional([
          shouldSupportSourceMap &&
            `./${mainSource}/common/source-map-support.js`,
          `./${mainSource}/preload.js`,
        ]),
        output: {
          filename: 'preload.js',
        },
        // Disable accepting browser version of modules
        resolve: {
          aliasFields: [],
          mainFields: ['module', 'main'],
        },
      },
      sharedConfig,
    ),
  ]
}
