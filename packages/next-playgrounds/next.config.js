const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('./internals/next-images-custom');

module.exports = withPlugins([
  withCSS,
  withImages,
  withFonts,
], {
  webpack(config) {
    // HACK: Quick fix to resolve the custom babel config in root directory
    config.module.rules.forEach((rule) => {
      if (rule.use && rule.use.loader === 'next-babel-loader') {
        // eslint-disable-next-line no-param-reassign
        rule.use.options.cwd = undefined;
      }
    });

    return config;
  },
});
