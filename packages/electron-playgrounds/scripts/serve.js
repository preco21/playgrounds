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
    process.kill(-instance.pid);
  }

  instance = execa('electron', ['.'], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    detached: true,
    env: {
      ELECTRON_ENABLE_LOGGING: true,
    },
  });

  instance.on('exit', () => (instance = null));
});
