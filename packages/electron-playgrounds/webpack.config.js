const {resolve} = require('path');
const {HashedModuleIdsPlugin} = require('webpack');
const {smart: webpackMergeSmart} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const CleanPlugin = require('clean-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const SizePlugin = require('size-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  app: {
    mainSource,
    appDest,
    cleanPaths = [],
  },
} = require('./package.json');

module.exports = (env, argv) => {
  const mode = env.mode || argv.mode;
  const isDev = mode === 'development';
  process.env.BABEL_ENV = `main-${mode}`;

  const sharedConfig = {
    mode,
    devtool: isDev ? 'eval-source-map' : undefined,
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
            cacheDirectory: isDev,
          },
        },
      ],
    },
    plugins: [
      !isDev && new HashedModuleIdsPlugin(),
      new DotenvPlugin(),
      new WebpackBarPlugin(),
      new SizePlugin(),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
        }),
      ],
    },
    externals: [
      nodeExternals(),
      nodeExternals({
        modulesDir: resolve(__dirname, '../../node_modules'),
      }),
    ],
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
      devtool: 'source-map',
      entry: [
        isDev && 'source-map-support/register',
        `./${mainSource}/index.js`,
      ].filter(Boolean),
      output: {
        filename: 'index.js',
      },
      plugins: [
        new CleanPlugin(cleanPaths),
      ],
    }, sharedConfig),
    webpackMergeSmart({
      target: 'electron-renderer',
      entry: `./${mainSource}/preload.js`,
      output: {
        filename: 'preload.js',
      },
    }, sharedConfig),
  ];
};
