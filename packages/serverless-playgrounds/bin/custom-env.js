#!/usr/bin/env node

'use strict';

require('dotenv/config');
const {promises: fs} = require('fs');
const execa = require('execa');

(async () => {
  try {
    // HACK: Due to stdio doesn't work as expected.
    await execa.shell('serverless print --format json > .serverless.json');
    const file = await fs.readFile('.serverless.json', 'utf-8');
    const slsConfig = JSON.parse(file);

    const envToInject = {
      // HACK: simple hacky solution to prevent babel-powered scripts recognized as in webpack environment
      BABEL_ENV: 'script',
      ...slsConfig.provider.environment,
    };

    console.log('> Injecting environment variables:', envToInject);

    await execa.shell(process.argv.slice(2).join(' '), {
      stdio: 'inherit',
      env: envToInject,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
