const execa = require('execa');
const {dependencies = {}, devDependencies = {}} = require('./package.json');

const env = process.env.BABEL_ENV || process.env.NODE_ENV || '';
const isMain = env.startsWith('main');
// const isDev = env.endsWith('development');

const electronVersion = getElectronVersion();

function getElectronVersionFromDependencyMap(deps = {}) {
  const [, bareVersion] = Object.entries(deps).find(([key]) => key === 'electron') || [];
  return bareVersion;
}

function getElectronVersion() {
  const depVersion = getElectronVersionFromDependencyMap({...dependencies, ...devDependencies});
  if (depVersion) {
    return depVersion;
  }

  const {stdout} = execa.sync('electron', ['--version']);
  return stdout && stdout.toString().trim().slice(1);
}

module.exports = {
  presets: isMain
    ? [
      ['@babel/preset-env', {
        targets: {
          electron: electronVersion,
        },
        modules: false,
        loose: true,
      }],
      '@babel/preset-stage-1',
    ]
    : [
      ['next/babel', {
        'preset-env': {
          targets: {
            electron: electronVersion,
          },
          loose: true,
        },
      }],
    ],
  plugins: [
    ...isMain
      ? [
        '@babel/plugin-transform-runtime',
      ]
      : [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        ['babel-plugin-styled-components', {ssr: true}],
      ],
    'babel-plugin-inline-dotenv',
  ],
};
