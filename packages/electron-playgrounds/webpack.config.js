const {resolve} = require('path');
const {
  DefinePlugin,
  optimize: {
    ModuleConcatenationPlugin,
  },
} = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {
  app: {
    mainSource,
    appDest,
    cleanPaths = [],
    externals = [],
  },
} = require('./package.json');

module.exports = ({dev} = {}) => {
  // Set `BABEL_ENV` for main process
  process.env.BABEL_ENV = dev ? 'main-development' : 'main-production';

  const sharedConfig = {
    devtool: dev ? 'source-map' : false,
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
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      }),
      ...dev
        ? []
        : [
          new ModuleConcatenationPlugin(),
          new UglifyJsPlugin({parallel: true}),
        ],
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    externals: externals
      .map((elem) => ({[elem]: `commonjs ${elem}`}))
      .reduce((res, elem) => ({...res, ...elem}), {}),
    node: {
      __dirname: false,
      __filename: false,
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
