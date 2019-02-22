/* eslint-disable no-console */
const {promisify} = require('util');
const {createServer} = require('http');
const next = require('next');
const webpack = require('webpack');
const execa = require('execa');
const treeKill = require('tree-kill');
const exitHook = require('exit-hook');
const webpackConfig = require('../webpack.config');
const packageJSON = require('../package.json');

const treeKillP = promisify(treeKill);

const instances = new Set();

const {
  app: {
    rendererSource,
    devServerPort = 3000,
  } = {},
} = packageJSON;

function killInstancesIfExists() {
  return Promise.all(
    Array.from(instances)
      .map(async (inst) => {
        await treeKillP(inst.pid);
        instances.delete(inst);
      }),
  );
}

(async () => {
  await devServer(rendererSource, devServerPort);

  exitHook(killInstancesIfExists);

  const compiler = webpack(webpackConfig({mode: 'development'}));
  compiler.watch({}, async (err, stats) => {
    console.log(stats.toString({
      chunks: false,
      modules: false,
      colors: true,
    }));

    if (err) {
      return;
    }

    await killInstancesIfExists();
    const instance = execa('electron', ['--inspect', '.'], {
      // stdio: 'inherit',
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_DISABLE_SECURITY_WARNINGS: true,
      },
    });

    instances.add(instance);
    instance.on('exit', () => instances.delete(instance));
  });
})();

async function devServer(dir, port) {
  const nextApp = next({dev: true, dir});
  const server = createServer(nextApp.getRequestHandler());

  await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.on('listening', () => resolve());
    server.listen(port);
  });

  await nextApp.prepare();
}
