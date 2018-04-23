const {resolve} = require('path');
const {
  DefinePlugin,
  optimize: {
    ModuleConcatenationPlugin,
  },
} = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const {
  app: {
    sourcePath,
    destPath,
    rendererPrefix,
    cleanPaths = [],
    externals = [],
  },
} = require('./package.json');

module.exports = ({dev} = {}) => {
  // Set `BABEL_ENV` for main process
  process.env.BABEL_ENV = dev ? 'main-development' : 'main-production';

  return {
    target: 'electron-main',
    devtool: dev ? 'source-map' : false,
    entry: [
      ...dev ? ['source-map-support/register'] : [],
      `./${sourcePath}/index.js`,
    ],
    output: {
      path: resolve(__dirname, destPath),
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: resolve(__dirname, sourcePath),
          loader: 'babel-loader',
          options: {
            cacheDirectory: dev,
          },
        },
      ],
    },
    plugins: [
      new CleanPlugin(cleanPaths),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
        __RENDERER_PREFIX__: JSON.stringify(rendererPrefix),
      }),
      ...dev
        ? []
        : [
          new ModuleConcatenationPlugin(),
          new BabelMinifyPlugin(),
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
};
