const execa = require('execa');
const {
  app: {
    sourcePath,
  } = {},
} = require('../package.json');

getInstallCommand().then((command) =>
  execa(...command, {
    cwd: sourcePath,
    stdout: process.stdout,
  }));

function getInstallCommand() {
  return execa('yarn', ['--version'])
    .then(({stdout}) => stdout && stdout.toString().trim())
    .then((isYarnAvailable) => isYarnAvailable
      ? ['yarn', ['install', '--no-bin-links']]
      : ['npm', ['install']]);
}
