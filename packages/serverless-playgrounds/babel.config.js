module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  const isScript = api.env('script');

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: '8.10',
        },
        modules: isScript && 'auto',
        useBuiltIns: 'usage',
      }],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
