const withCSS = require('@zeit/next-css');
const DotenvPlugin = require('dotenv-webpack');

module.exports = withCSS({
  webpack(config) {
    // HACK: Quick fix to resolve the custom babel config in root directory
    config.module.rules.forEach((rule) => {
      if (rule.use.loader === 'next-babel-loader') {
        // eslint-disable-next-line no-param-reassign
        rule.use.options.cwd = undefined;
      }
    });

    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
      },
    });

    config.plugins.push(new DotenvPlugin());

    return config;
  },
});
