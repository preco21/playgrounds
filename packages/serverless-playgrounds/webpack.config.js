const {resolve} = require('path');
const {HashedModuleIdsPlugin} = require('webpack');
const nodeExternals = require('webpack-node-externals');
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
    !slsw.lib.webpack.isLocal && new HashedModuleIdsPlugin(),
    new DotenvPlugin(),
    new WebpackBarPlugin(),
    new SizePlugin(),
  ].filter(Boolean),
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: resolve(__dirname, '../node_modules'),
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
