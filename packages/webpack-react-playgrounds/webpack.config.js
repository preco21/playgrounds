/* eslint-disable complexity */
const {resolve} = require('path');
const {
  HashedModuleIdsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CrittersPlugin = require('critters-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const SizePlugin = require('size-plugin');
const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const packageJSON = require('./package.json');

const {loader: miniCSSExtractLoader} = MiniCSSExtractPlugin;

const buildConfig = {
  source: 'src',
  dest: 'build',
  clean: [
    'build',
  ],
  copy: [
    'static',
  ],
  serve: {
    port: 3000,
    host: 'localhost',
  },
  paths: ['/'],
  ...packageJSON.config,
};

module.exports = (env = {}, argv = {}) => {
  const mode = env.mode || argv.mode;
  const isDev = mode === 'development';

  return {
    mode,
    devtool: isDev ? 'cheap-module-source-map' : 'nosources-source-map',
    entry: `./${buildConfig.source}/index.js`,
    output: {
      filename: `[name]${isDev ? '' : '.[chunkhash]'}.js`,
      path: resolve(__dirname, buildConfig.dest),
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: resolve(__dirname, buildConfig.source),
          loader: 'babel-loader',
          options: {
            envName: mode,
            cacheDirectory: isDev,
          },
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : miniCSSExtractLoader,
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
    plugins: [
      !isDev && new CleanPlugin(buildConfig.clean),
      new CopyPlugin(buildConfig.copy),
      ...buildConfig.paths.map((path) => new HTMLPlugin({
        filename: `${path === '/' ? '' : `${path.slice(1)}/`}index.html`,
        template: isDev
          ? `${buildConfig.source}/document.ejs`
          : `!!prerender-loader?${JSON.stringify({string: true, params: {path}})}!${buildConfig.source}/document.ejs`,
        minify: !isDev && {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        },
      })),
      isDev && new AutoDllPlugin({
        inject: true,
        filename: '[name]_[hash].js',
        path: './dll',
        entry: {
          vendor: [
            'react',
            'react-dom',
          ],
        },
      }),
      !isDev && new HashedModuleIdsPlugin(),
      isDev && new HotModuleReplacementPlugin(),
      !isDev && new MiniCSSExtractPlugin({
        filename: `[name]${isDev ? '' : '.[contenthash]'}.css`,
      }),
      !isDev && new CrittersPlugin(),
      isDev && new HardSourceWebpackPlugin(),
      new DotenvPlugin(),
      isDev && new FriendlyErrorWebpackPlugin(),
      !isDev && new WebpackBarPlugin(),
      !isDev && new SizePlugin(),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          cache: true,
        }),
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    devServer: {
      inline: true,
      hotOnly: true,
      historyApiFallback: true,
      overlay: {
        errors: true,
      },
      quiet: true,
      stats: {
        colors: true,
      },
      ...buildConfig.serve,
    },
  };
};
