const withCSS = require('@zeit/next-css');
const globby = require('globby');
const {app: {rendererSource}} = require('./package.json');

module.exports = withCSS({
  exportPathMap() {
    return globby([`${rendererSource}/pages/**/*.js`, `!${rendererSource}/pages/_document.js`])
      .then((paths) => paths.reduce((res, path) => {
        const [,, pathToken] = path.split(/(pages|\.)/);
        const page = pathToken.replace(/^\/index$/, '/');

        // eslint-disable-next-line no-param-reassign
        res[page] = {page};
        return res;
      }, {}));
  },
});
