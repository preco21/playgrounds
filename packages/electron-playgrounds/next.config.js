const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');
const withCSS = require('@zeit/next-css');
const globby = require('globby');
const {app: {sourcePath}} = require('./package.json');

module.exports = (phase) => withCSS({
  webpack(config) {
    // Set `BABEL_ENV` for renderer process
    process.env.BABEL_ENV = phase === PHASE_DEVELOPMENT_SERVER ? 'renderer-development' : 'renderer-production';

    // FIXME: Current version of Electron does not supports object-rest-spread operator.
    // It could be fixed in next release of Electron.
    // eslint-disable-next-line no-restricted-properties
    return Object.assign({}, config, {
      target: 'electron-renderer',
    });
  },
  exportPathMap() {
    return globby([`${sourcePath}/pages/**/*.js`, `!${sourcePath}/pages/_document.js`])
      .then((paths) => paths.reduce((res, path) => {
        const [,, pathToken] = path.split(/(pages|\.)/);
        const page = pathToken.replace(/^\/index$/, '/');

        // eslint-disable-next-line no-param-reassign
        res[page] = {page};
        return res;
      }, {}));
  },
});
