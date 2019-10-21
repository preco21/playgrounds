const DotenvPlugin = require('dotenv-webpack')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const withFonts = require('@preco21/next-fonts')

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

module.exports = withPlugins([withCSS, withImages, withFonts, withDotenv], {
  poweredByHeader: false,
  devIndicators: {
    autoPrerender: false,
  },
})
