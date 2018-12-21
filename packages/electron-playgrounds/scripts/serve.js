/* eslint-disable no-console */
const {promisify} = require('util');
const {createServer} = require('http');
const webpack = require('webpack');
const execa = require('execa');
const treeKill = require('tree-kill');
const exitHook = require('exit-hook');
const webpackConfig = require('../webpack.config');
const packageJSON = require('../package.json');

const treeKillP = promisify(treeKill);

const instances = new Set();
const compiler = webpack(webpackConfig({mode: 'development'}));

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
      stdio: 'inherit',
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
  const next = require('next');
  const nextApp = next({dev: true, dir});
  await nextApp.prepare();

  const server = createServer(nextApp.getRequestHandler());
  server.listen(port);

  return `http://localhost:${port}/`;
}

