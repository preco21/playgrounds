const webpack = require('webpack');
const exitHook = require('exit-hook');
const execa = require('execa');
const webpackConfig = require('../webpack.config');

const compiler = webpack(webpackConfig({dev: true}));

let instance = null;

exitHook(killInstanceIfExists);
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

  killInstanceIfExists();
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

function killInstanceIfExists() {
  if (instance) {
    process.kill(-instance.pid);
  }
}
