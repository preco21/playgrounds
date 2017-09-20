# Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)
[![Build Status](https://travis-ci.org/preco21/playgrounds.svg?branch=master)](https://travis-ci.org/preco21/playgrounds)
[![Dependency Status](https://dependencyci.com/github/preco21/playgrounds/badge)](https://dependencyci.com/github/preco21/playgrounds)

> Yay!

A simple playgrounds for testing ES2015+ code.

## Install

```bash
$ git clone https://github.com/preco21/playgrounds.git
$ cd playgrounds
$ npm install
```

## Usage

### Run

Run `nodemon` demon for _live-reloading_, once daemon started then start editing `index.js` in `src`!

```bash
$ npm run dev
```

### Run with Inspector

If you would like to use [V8 Inspector Integration](https://nodejs.org/api/debugger.html#debugger_v8_inspector_integration_for_node_js), make sure you are on Node.js v6+ then run following command:

```bash
$ npm run dev-inspect
```

* https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27#.9x5t2kauw

### Build

Build all source of `src`.

```bash
$ npm run build
```

### Clean

Clean build directory.

```base
$ npm run clean
```

### Standalone

**You will need to build before run this command.**

```bash
npm start
```

## License

[MIT](https://preco.mit-license.org/)
