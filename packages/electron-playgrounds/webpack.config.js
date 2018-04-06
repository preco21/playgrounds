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
    cleanPaths,
  } = {},
} = require('./package.json');
const {dependencies = {}, devDependencies = {}} = require('./src/package.json');

module.exports = ({dev} = {}) => {
  // Set `BABEL_ENV` for main process
  process.env.BABEL_ENV = dev ? 'main-development' : 'main-production';

  return {
    target: 'electron-main',
    devtool: dev ? 'eval-source-map' : false,
    entry: `./${sourcePath}/index.js`,
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
        'process.env': {
          NODE_ENV: JSON.stringify(dev ? 'development' : 'production'),
          RENDERER_PREFIX: JSON.stringify(rendererPrefix),
        },
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
    externals: Object.keys({...dependencies, ...devDependencies})
      .map((elem) => ({[elem]: `commonjs ${elem}`}))
      .reduce((res, elem) => ({...res, ...elem}), {}),
    node: {
      __dirname: false,
      __filename: false,
    },
  };
};
