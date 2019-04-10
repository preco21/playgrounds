module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: '8.10',
        },
        modules: false,
        useBuiltIns: 'usage',
      }],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
