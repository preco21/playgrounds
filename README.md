# Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)
[![Build Status](https://travis-ci.org/preco21/playgrounds.svg?branch=master)](https://travis-ci.org/preco21/playgrounds)
[![Dependency Status](https://dependencyci.com/github/preco21/playgrounds/badge)](https://dependencyci.com/github/preco21/playgrounds)

> Yay!

A minimal setup for writing ES2015+ code.

* Babel configuration which contains preset `env`, `stage-1` and `minify` (used when in production build).
* Live-reloading code with `nodemon` and `babel-node`.
* Packing your app with `pkg`

## Install

```bash
$ git clone https://github.com/preco21/playgrounds.git
$ cd playgrounds
$ npm install
```

## Usage

### Development mode

Following command executes `nodemon` demon for _live-reloading_ and once the daemon started, you can start editing `index.js` in `src`!

```bash
$ npm run dev
```

### Development mode with inspector

If you would like to use [V8 Inspector Integration](https://nodejs.org/api/debugger.html#debugger_v8_inspector_integration_for_node_js), make sure you are on Node.js v6+ then run following command:

```bash
$ npm run dev-inspect
```

### Build

Builds your source code with Babel from `src` into `lib`.

```bash
$ npm run build
```

After building the code, you will be able to run the built code like standalone version of the application:

```bash
npm start
```

### Packaging

You can easily create standalone executables by this command, which generates the executables in `bin` folder:

```bash
$ npm run package
```

The generated runnable app can run without any runtime dependencies.

### Clean

Cleans build output directory. This command will remove any content inside `lib` folder.

```base
$ npm run clean
```

## License

[MIT](https://preco.mit-license.org/)
