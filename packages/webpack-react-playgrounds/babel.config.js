module.exports = (api) => {
  const isDev = api.env('development')
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: 'last 2 version',
          },
          modules: false,
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      'react-hot-loader/babel',
      'react-imported-component/babel',
      ['babel-plugin-styled-components', { ssr: true, displayName: isDev }],
    ],
  }
}
