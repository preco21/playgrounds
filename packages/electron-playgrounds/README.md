# Electron Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)

> :rocket: Yet another opinionated setup for Electron application

* Core setup from the original [playgrounds](https://github.com/preco21/playgrounds).
* Clean and minimal setup to build React based Electron app with `webpack` and `next.js`.
* Live-reloading (hot) works on both `main` and `renderer` processes.
* Package executable app via `electron-builder`.

## Install

```bash
$ git clone https://github.com/preco21/electron-playgrounds.git

$ cd electron-playgrounds
$ npm install
```

**Prerequisite:** Node.js 8 or higher.

**Note:** If you are on [Windows Subsystem for Linux](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux), make sure you have set the proper environment variable before installing to let electron to use right binary for the platform: `npm_config_platform=win32`.

## Usage

### Development mode

This command will run internal script to provide _live-reloading_ for `main` process. After that, `main` process will run `electron-next` to serve `renderer` process.

```bash
$ npm run dev
```

When the dev server has started, you can start editing components in `pages` folder. Also you can edit `index.js` for `main` process. Any changes made within `src` folder will trigger live-reload automatically.

### Build

This command will bundle all the code inside `src` folder to `app` folder with `webpack` and `next.js`.

```bash
$ npm run build
```

After building, you will be able to run app as a standalone on the fly:

```bash
$ npm start
```

### Package

This command will package app with `electron-builder` and this will generate the executable binaries in `build` folder:

```bash
$ npm run package
```

This executable binaries is available to run without any runtime dependencies.

### Clean

This command will remove any content inside the output directory which made by `build` command.

```bash
$ npm run clean
```

## License

[MIT](https://preco.mit-license.org/)
