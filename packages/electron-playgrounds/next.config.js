const path = require('path')
const { PHASE_PRODUCTION_BUILD, PHASE_EXPORT } = require('next/constants')
const DotenvPlugin = require('dotenv-webpack')
const withPlugins = require('next-compose-plugins')
const withCustomBabelConfig = require('next-plugin-custom-babel-config')
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

function withElectronProtocolPrefix(nextConfig = {}) {
  return {
    ...nextConfig,
    phases: [PHASE_PRODUCTION_BUILD + PHASE_EXPORT],
    assetPrefix: 'next:///',
  }
}

const withDotenv = mixinWebpackConfig((config) =>
  config.plugins.push(new DotenvPlugin()),
)

module.exports = withPlugins([
  withElectronProtocolPrefix,
  withCSS,
  withImages,
  withFonts,
  [withCustomBabelConfig, { babelConfigFile: path.resolve('babel.config.js') }],
  withDotenv,
])
