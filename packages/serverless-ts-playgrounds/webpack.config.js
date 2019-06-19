const { resolve } = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')

const entriesWithSourceMapSupport = Object.entries(slsw.lib.entries).reduce(
  (res, [name, entry]) => ({
    ...res,
    [name]: ['source-map-support/register', entry],
  }),
  {},
)

module.exports = {
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  entry: entriesWithSourceMapSupport,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: resolve('src'),
        options: { transpileOnly: true },
      },
    ],
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.tsx', '.ts', '.json'],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new DotenvPlugin()],
  externals: [nodeExternals()],
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
  stats: {
    modules: false,
  },
}
