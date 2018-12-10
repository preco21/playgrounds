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
      ['babel-plugin-styled-components', {ssr: true, displayName: isDev}],
    ],
  };
};
