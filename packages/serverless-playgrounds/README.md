# Serverless Playgrounds

[![Code Style Prev](https://img.shields.io/badge/code%20style-prev-32c8fc.svg)](https://github.com/preco21/eslint-config-prev)

> 🚀 Yet another minimal setup for Serverless app

* Core setup for Serverless
* Babel integrated via `serverless-webpack`.

## Install

```bash
$ git clone https://github.com/preco21/serverless-playgrounds.git

$ cd serverless-playgrounds
$ yarn
```

## CLI

You can either use global `serverless` cli or local one with `npx`:

```bash
# Using global one
$ yarn global add serverless
$ serverless deploy

# Using local one
$ npx serverless deploy
```

**Note:** You can also use `sls` as an alias of `serverless`.

## Usage

Now you can take a look `serverless.yml` for configuration and start editing `src/index.js`.

### Development

You can test your functions locally with following command:

```bash
$ serverless invoke-local [--data '{"name": "Foo"}'] [function-name]
```

Or run from the cloud directly after deploy:

```bash
$ serverless invoke [--data '{"name": "Foo"}'] [function-name]
```

### Logging

You can also see the logs for debugging by running:

```bash
$ serverless logs --tail --function [function-name]
```

### Deploy

You can easily deploy your app with Serverless by running this single command:

```bash
$ serverless deploy
```
