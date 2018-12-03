module.exports = (api) => {
  const isDev = api.env('development');
  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: 'last 2 version',
        },
        modules: false,
        useBuiltIns: 'usage',
        loose: true,
      }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      'babel-plugin-inline-dotenv',
      'react-hot-loader/babel',
      ['babel-plugin-styled-components', {ssr: true, displayName: isDev}],
    ],
  };
};
