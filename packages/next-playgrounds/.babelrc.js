const env = process.env.BABEL_ENV || process.env.NODE_ENV || '';
const isDev = env.includes('development');

module.exports = {
  presets: [
    ['next/babel', {
      'preset-env': {
        targets: {
          browsers: 'last 2 version',
        },
        loose: true,
      },
    }],
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    ['babel-plugin-styled-components', {ssr: true, displayName: isDev}],
    'babel-plugin-inline-dotenv',
  ],
};
