const {resolve} = require('path');
const {
  HashedModuleIdsPlugin,
} = require('webpack');
const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const {
  app: {
    mainSource,
    appDest,
    cleanPaths = [],
  },
} = require('./package.json');

module.exports = ({dev} = {}) => {
  const env = dev ? 'development' : 'production';
  process.env.BABEL_ENV = `main-${env}`;

  const sharedConfig = {
    mode: env,
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
            cacheDirectory: dev,
          },
        },
      ],
    },
    plugins: [
      ...dev ? [] : [new HashedModuleIdsPlugin()],
      new DotenvPlugin(),
    ],
    externals: [nodeExternals()],
    node: {
      __dirname: false,
      __filename: false,
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
        }),
      ],
    },
    performance: {
      hints: false,
    },
  };

  return [
    webpackMerge({
      target: 'electron-main',
      entry: [
        ...dev ? ['source-map-support/register'] : [],
        `./${mainSource}/index.js`,
      ],
      output: {
        filename: 'index.js',
      },
      plugins: [
        new CleanPlugin(cleanPaths),
      ],
    }, sharedConfig),
    webpackMerge({
      target: 'electron-renderer',
      entry: `./${mainSource}/preload.js`,
      output: {
        filename: 'preload.js',
      },
    }, sharedConfig),
  ];
};
