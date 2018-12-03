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
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const WebpackBarPlugin = require('webpackbar');
const SizePlugin = require('size-plugin');
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
    host: '0.0.0.0',
  },
  ...packageJSON.config,
};

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  process.env.BABEL_ENV = argv.mode;

  return {
    devtool: isDev ? 'eval-source-map' : undefined,
    entry: `./${buildConfig.source}/index.js`,
    output: {
      path: resolve(__dirname, buildConfig.dest),
      filename: `[name]${isDev ? '' : '.[chunkhash]'}.js`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: resolve(__dirname, buildConfig.source),
          loader: 'babel-loader',
          options: {
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
      new HTMLPlugin({
        template: `${buildConfig.source}/document.ejs`,
        minify: !isDev && {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        },
      }),
      !isDev && new HashedModuleIdsPlugin(),
      isDev && new HotModuleReplacementPlugin(),
      !isDev && new MiniCSSExtractPlugin({
        filename: `[name]${isDev ? '' : '.[contenthash]'}.css`,
      }),
      !isDev && new CrittersPlugin(),
      new DotenvPlugin(),
      new WebpackBarPlugin(),
      new SizePlugin(),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
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
      stats: {
        colors: true,
      },
      ...buildConfig.serve,
    },
  };
};
