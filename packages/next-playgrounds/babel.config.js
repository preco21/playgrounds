module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV)
  const isDev = api.env('development')

  return {
    presets: [
      [
        'next/babel',
        {
          'preset-env': {
            targets: {
              browsers: 'last 2 version',
            },
          },
        },
      ],
    ],
    plugins: [
      ['babel-plugin-styled-components', { ssr: true, displayName: isDev }],
    ],
  }
}
