const {PHASE_PRODUCTION_BUILD, PHASE_EXPORT} = require('next/constants');
const DotenvPlugin = require('dotenv-webpack');
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withFonts = require('next-fonts');

function withElectronProtocolPrefix(nextConfig = {}) {
  return {
    ...nextConfig,
    phases: [PHASE_PRODUCTION_BUILD + PHASE_EXPORT],
    assetPrefix: 'next:///',
  };
}

function withCustomBabelConfig({webpack, ...nextConfig} = {}, {phase} = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const env = phase === PHASE_PRODUCTION_BUILD ? 'production' : 'development';

      config.module.rules.forEach((rule) => {
        if (rule.use && rule.use.loader === 'next-babel-loader') {
          rule.use.options.cwd = undefined;
          rule.use.options.envName = `renderer-${env}`;
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
  withElectronProtocolPrefix,
  withCSS,
  withImages,
  withFonts,
  withCustomBabelConfig,
  withDotenv,
]);
