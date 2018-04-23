export function checkIfTampered() {
  const forbiddenEnvs = [
    'ELECTRON_ENABLE_LOGGING',
    'ELECTRON_LOG_ASAR_READS',
    'ELECTRON_ENABLE_STACK_DUMPING',
  ];

  const forbiddenArgs = [
    '--auth-negotiate-delegate-whitelist',
    '--auth-server-whitelist',
    '--disable-renderer-backgrounding',
    '--enable-logging',
    '--host-resolver-rules',
    '--host-rules',
    '--inspect-brk',
    '--inspect',
    '--js-flags',
    '--log-net-log',
    '--no-proxy-server',
    '--ppapi-flash-path',
    '--ppapi-flash-version',
    '--proxy-bypass-list',
    '--proxy-pac-url',
    '--proxy-server',
    '--remote-debugging-address',
    '--remote-debugging-port',
    '--remote-debugging-socket-fd',
    '--remote-debugging-socket-name',
    '--remote-debugging-targets',
    '--user-data-dir',
    '--v',
    '--vmodule',
  ];

  const {env: envs} = process;
  const args = process.argv.slice(1);

  const tamperedEnvs = forbiddenEnvs.filter((env) => envs[env] !== undefined);
  const tamperedArgs = forbiddenArgs.filter((forbiddenArg) => args.some((arg) => forbiddenArg === arg));

  const isValid = tamperedEnvs.length < 1 && tamperedArgs.length < 1;

  return {
    valid: isValid,
    tamperedEnvs,
    tamperedArgs,
  };
}

export function installDevExtensions(extentions) {
  const {default: installExtension, ...devtools} = require('electron-devtools-installer');
  return Promise.all(extentions.map((name) => installExtension(devtools[name])));
}
