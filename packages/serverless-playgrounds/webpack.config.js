const {resolve} = require('path');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const SizePlugin = require('size-plugin');
const slsw = require('serverless-webpack');

module.exports = {
  target: 'node',
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: slsw.lib.webpack.isLocal,
        },
      },
    ],
  },
  plugins: [
    new DotenvPlugin(),
    new WebpackBarPlugin(),
    new SizePlugin(),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  performance: {
    hints: false,
  },
};
