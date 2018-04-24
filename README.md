# Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)
[![Build Status](https://travis-ci.org/preco21/playgrounds.svg?branch=master)](https://travis-ci.org/preco21/playgrounds)
[![Dependency Status](https://dependencyci.com/github/preco21/playgrounds/badge)](https://dependencyci.com/github/preco21/playgrounds)

> :rocket: An opinionated setup for writing ES2015+ code

* Babel configuration that contains preset `env (current)`, `stage-1` and `minify` (used in production build).
* Live-reloading code with `nodemon` and `babel-node`.
* Debugging with [Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27) out of box.
* Package app with `pkg`.

## Install

```bash
$ git clone https://github.com/preco21/playgrounds.git

$ cd playgrounds
$ npm install
```

## Usage

### Development mode

This command will run `nodemon` demon for _live-reloading_ experiences. Once the daemon started, you can start editing `index.js` in `src` folder!

```bash
$ npm run dev
```

### Development mode with Chrome DevTools

You may be heard about [Node.js V8 Inspector Integration](https://nodejs.org/api/debugger.html#debugger_v8_inspector_integration_for_node_js) which allows you to attach your Node.js application to Chrome DevTools for better debugging and profiling. To use this fantastic feature, make sure you are running **Node.js 6+** and **Chrome 60+**, then go to the Chrome inspector page first:

> [chrome://inspect/#devices](chrome://inspect/#devices)

Then click the `Open dedicated DevTools for Node` link to open devtools, run following command:

```bash
$ npm run dev-inspect
```

Now you can place `debugger` keyword in your code to specify breakpoints:

```js
function foo(a, b) {
  return a * b;
}

const bar = foo(1, 2);
debugger;
```

**Note:** You can also use `npm run dev-inspect-brk` to break before the code starts.

#### References

* [Debugging Node.js with Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27)
* [Debugging Node.js with Google Chrome](https://medium.com/the-node-js-collection/debugging-node-js-with-google-chrome-4965b5f910f4)
* [Can I get node --inspect to open Chrome automatically](https://stackoverflow.com/questions/41398970/can-i-get-node-inspect-to-open-chrome-automatically)

### Build

This command will build your code with Babel from `src` into `lib`.

```bash
$ npm run build
```

After building, you will be able to run app like standalone version of the application:

```bash
npm start
```

Typically, this is recommended for production.

### Packaging

You can also create standalone executables with this command and this will generate the executable binaries in `bin` folder:

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
