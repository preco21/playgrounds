module.exports = (api) => {
  const isDev = api.env('development');
  return {
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
};
