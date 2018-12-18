const execa = require('execa');

function getElectronVersion() {
  const {stdout} = execa.sync('electron', ['--version'], {env: {ELECTRON_RUN_AS_NODE: true}});
  return stdout && stdout.toString().trim().slice(1);
}

module.exports = (api) => {
  const electronVersion = getElectronVersion();
  const isMain = api.env((envName) => envName.startsWith('main'));
  const isDev = api.env((envName) => envName.endsWith('development'));

  return {
    presets: isMain
      ? [
        ['@babel/preset-env', {
          targets: {
            electron: electronVersion,
          },
          modules: false,
          loose: true,
        }],
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
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
      ...isMain
        ? [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-class-properties',
        ]
        : [
          ['babel-plugin-styled-components', {ssr: true, displayName: isDev}],
        ],
    ],
  };
};
