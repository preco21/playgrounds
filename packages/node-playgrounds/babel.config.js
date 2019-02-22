module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    sourceMaps: true,
    retainLines: true,
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: true,
        },
        useBuiltIns: 'usage',
        loose: true,
      }],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
