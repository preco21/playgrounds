const {resolve} = require('path');
const {DefinePlugin} = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const slsw = require('serverless-webpack');

module.exports = {
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src', '**/*.js'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: slsw.lib.webpack.isLocal,
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(slsw.lib.webpack.isLocal ? 'development' : 'production'),
    }),
    new DotenvPlugin(),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  performance: {
    hints: false,
  },
};
