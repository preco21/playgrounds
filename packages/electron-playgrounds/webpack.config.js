const {resolve} = require('path');
const {HashedModuleIdsPlugin} = require('webpack');
const {smart: webpackMergeSmart} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const CleanPlugin = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const SizePlugin = require('size-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {StatsWriterPlugin} = require('webpack-stats-plugin');
const {
  dependencies = {},
  app: {
    mainSource,
    appDest,
    cleanPaths = [appDest],
  },
} = require('./package.json');

module.exports = (env = {}, argv = {}) => {
  const mode = env.mode || argv.mode;
  const isDev = mode === 'development';

  const shouldSupportSourceMap = !process.env.NO_SOURCE_MAP_SUPPORT;
  const chooseSourceMap = () => {
    if (shouldSupportSourceMap) {
      return isDev
        ? 'cheap-module-source-map'
        : 'nosources-source-map';
    }

    return undefined;
  };

  const sharedConfig = {
    mode,
    devtool: chooseSourceMap(),
    output: {
      path: resolve(__dirname, appDest),
    },
    module: {
      rules: [
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
          test: /\.(m?js|node)$/,
          parser: {amd: false},
          loader: '@zeit/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'res',
          },
        },
      ].filter(Boolean),
    },
    plugins: [
      !isDev && new HashedModuleIdsPlugin(),
      new DotenvPlugin(),
      new WebpackBarPlugin(),
      !isDev && new SizePlugin(),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: shouldSupportSourceMap,
          cache: true,
          parallel: true,
          terserOptions: {
            mangle: false,
          },
        }),
      ],
    },
    externals: nodeExternals({
      whitelist: isDev
        ? []
        : (moduleName) => Object.keys(dependencies).some((name) => name === moduleName),
    }),
    node: {
      __dirname: false,
      __filename: false,
    },
    performance: {
      hints: false,
    },
  };

  return [
    webpackMergeSmart({
      target: 'electron-main',
      entry: [
        shouldSupportSourceMap && `./${mainSource}/common/source-map-support.js`,
        `./${mainSource}/index.js`,
      ].filter(Boolean),
      output: {
        filename: 'index.js',
      },
      plugins: [
        new CleanPlugin(cleanPaths, {verbose: false}),
        !isDev && new StatsWriterPlugin({
          filename: 'index.stats.json',
          fields: ['modules'],
        }),
      ].filter(Boolean),
    }, sharedConfig),
    webpackMergeSmart({
      target: 'electron-renderer',
      entry: [
        shouldSupportSourceMap && `./${mainSource}/common/source-map-support.js`,
        `./${mainSource}/preload.js`,
      ].filter(Boolean),
      output: {
        filename: 'preload.js',
      },
      plugins: [
        !isDev && new StatsWriterPlugin({
          filename: 'preload.stats.json',
          fields: ['modules'],
        }),
      ].filter(Boolean),
      // Disable accepting browser version of modules
      resolve: {
        aliasFields: [],
        mainFields: ['module', 'main'],
      },
    }, sharedConfig),
  ];
};
