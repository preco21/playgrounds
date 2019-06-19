# Serverless + Next.js + Typescript Playgrounds

## Install

```bash
$ yarn
$ yarn setup
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

You will need to setup credentials first before deploying: [Setting up credentials on AWS](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

Then, you can easily deploy your app with Serverless by running this single command:

```bash
$ serverless deploy
```

### Custom scripts

You can use `custom-env` package command to populate serverless related environment variables to use in your scripts.

It will take `serverless.yml` config as an input and process through `serverless print` command to pre-compute the resulting config, then pass the content of `self:provider.environment` via environment variables through to the given command.

```bash
$ npx custom-env node scripts/custom-script.js
$ yarn run custom-script
```

### Remove

If you think the service is no longer needed, you can remove it from the cloud by running:

```bash
$ serverless remove
```

## License

[MIT](https://preco.mit-license.org/)
