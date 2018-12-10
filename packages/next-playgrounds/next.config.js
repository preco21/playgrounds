const withPlugins = require('next-compose-plugins');
const withPurgeCSS = require('next-purgecss');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

module.exports = withPlugins([
  withPurgeCSS,
  withCSS,
  withImages,
  withFonts,
], {
  webpack(config) {
    // HACK: Quick fix to resolve the custom babel config in root directory
    config.module.rules.forEach((rule) => {
      if (rule.use.loader === 'next-babel-loader') {
        // eslint-disable-next-line no-param-reassign
        rule.use.options.cwd = undefined;
      }
    });

    return config;
  },
});
