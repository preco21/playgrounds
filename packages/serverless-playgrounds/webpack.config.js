const {resolve} = require('path');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const slsw = require('serverless-webpack');
const {dependencies = {}, externals = []} = require('./package.json');

const dependenciesToExclude = Object.keys(dependencies).filter((name) => externals.includes(name));

function optional(arr = []) {
  return arr.filter(Boolean);
}

module.exports = {
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  entry: slsw.lib.entries,
  module: {
    rules: optional([
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: slsw.lib.webpack.isLocal,
        },
      },
      !slsw.lib.webpack.isLocal && {
        test: /\.(js|mjs|node)$/,
        parser: {amd: false},
        loader: '@zeit/webpack-asset-relocator-loader',
        options: {
          outputAssetBase: 'res',
        },
      },
    ]),
  },
  plugins: [
    new DotenvPlugin(),
    new WebpackBarPlugin(),
  ],
  externals: dependenciesToExclude.reduce((res, name) => ({
    ...res,
    [name]: `commonjs ${name}`,
  }), {}),
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
};
