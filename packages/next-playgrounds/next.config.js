const withCSS = require('@zeit/next-css');
const globby = require('globby');

const pagePaths = ['src/pages/**/*.js'];
const pageExtension = '.html';

module.exports = withCSS({
  webpack(config) {
    config.module.rules.push({
      test: /\.(svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
      },
    });

    return config;
  },
  exportPathMap() {
    return globby(pagePaths)
      .then((paths) => paths
        .map((path) => {
          const [,, pageToken] = path.split(/(pages|\.)/);
          return pageToken;
        })
        .filter((pageToken) => !pageToken.startsWith('/_'))
        .reduce((res, pageToken) => {
          const page = pageToken.replace(/^\/index$/, '/');
          return {
            ...res,
            [`${pageToken}${pageExtension}`]: {page},
          };
        }, {}));
  },
});
