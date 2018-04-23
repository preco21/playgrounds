const webpack = require('webpack');
const execa = require('execa');
const webpackConfig = require('../webpack.config');

const compiler = webpack(webpackConfig({dev: true}));

let instance = null;
compiler.watch({}, (err, stats) => {
  // eslint-disable-next-line no-console
  console.log(stats.toString({
    chunks: false,
    modules: false,
    colors: true,
  }));

  if (err) {
    return;
  }

  if (instance) {
    instance.kill();
  }

  // https://www.google.com/search?q=node+how+to+kill+process&oq=node+how+to+kill+process&aqs=chrome..69i57j0l5.4222j0j1&sourceid=chrome&ie=UTF-8
  instance = execa('electron', ['.'], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
    },
  });
});
