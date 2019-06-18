const path = require('path')
const DotenvPlugin = require('dotenv-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const withPlugins = require('next-compose-plugins')
const withCustomBabelConfig = require('next-plugin-custom-babel-config')
const withTypescript = require('@zeit/next-typescript')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const withFonts = require('next-fonts')

function mixinWebpackConfig(fn) {
  return ({ webpack, ...nextConfig }, extras) => ({
    ...nextConfig,
    webpack(config, options) {
      fn(config, options, extras)

      if (typeof webpack === 'function') {
        return webpack(config, options)
      }

      return config
    },
  })
}

const withDotenv = mixinWebpackConfig((config) =>
  config.plugins.push(new DotenvPlugin()),
)

const withTypeChecked = mixinWebpackConfig((config, options) => {
  if (options.isServer) {
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve('tsconfig.json'),
      }),
    )
  }
})

module.exports = withPlugins([
  withCSS,
  withImages,
  withFonts,
  [withCustomBabelConfig, { babelConfigFile: path.resolve('babel.config.js') }],
  withTypescript,
  withTypeChecked,
  withDotenv,
])
