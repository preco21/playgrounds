const {PHASE_PRODUCTION_BUILD} = require('next/constants');
const DotenvPlugin = require('dotenv-webpack');
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

function withCustomBabelConfig({webpack, ...nextConfig} = {}, {phase} = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      config.module.rules.forEach((rule) => {
        if (rule.use && rule.use.loader === 'next-babel-loader') {
          // eslint-disable-next-line no-param-reassign
          rule.use.options.cwd = undefined;

          const env = phase === PHASE_PRODUCTION_BUILD ? 'production' : 'development';
          rule.use.options.envName = env;
        }
      });

      if (typeof webpack === 'function') {
        return webpack(config, options);
      }

      return config;
    },
  };
}

function withDotenv({webpack, ...nextConfig} = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      config.plugins.push(new DotenvPlugin());

      if (typeof webpack === 'function') {
        return webpack(config, options);
      }

      return config;
    },
  };
}

module.exports = withPlugins([
  withCSS,
  withImages,
  withFonts,
  withCustomBabelConfig,
  withDotenv,
]);
