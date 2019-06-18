# Electron Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)

> :rocket: Yet another opinionated setup for Electron application

- Utilize the power of [Next.js](https://nextjs.org/)
- Fundamantal concepts to cover production-ready application.
- Live-reloading (HMR) support for both `main` and `renderer` processes.
- Non-trivial tasks made easy by using handy internal modules.
- Painless packaging with rich configurations + full optimization of the bundle sizes.
- Full `source-map` support for better debugging experiences.

## Core ideas

- Just Works™
- Automate a process of the development cycle as much as possible.
- Provide some util for common tasks.
- Utilizing webpack and next.js to maximize tooling experiences and performances.
- Exclude modules that is not necessary for the production being bundled into a final package.

## Install

```bash
$ yarn
```

**Prerequisite:** Node.js 10 or higher.

**Note:** If you are on [Windows Subsystem for Linux](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux), make sure you have set the proper environment variable before installing to let electron to use right binary for the platform: `npm_config_platform=win32`.

## Usage

### Development

This command will run internal script to provide _live-reloading_ for `main` process. After that, `main` process will run `electron-next` to serve `renderer` process.

```bash
$ yarn run dev
```

When the dev server has started, you can start editing components in `pages` folder. Also you can edit `index.js` for `main` process. Any changes made within `main` and `src` folder will trigger live-reload automatically.

### Build

This command will bundle the sources to `app` folder with `webpack` and `next.js`.

```bash
$ yarn run build
```

After building, you will be able to run app as a standalone on the fly:

```bash
$ yarn start
```

### Package

This command will package app with `electron-builder` and this will generate the executable binaries in `build` folder:

```bash
$ yarn run package
```

This executable binaries is available to run without any runtime dependencies.

## License

[MIT](https://preco.mit-license.org/)
