const esbuild = require('esbuild');
const { isUndefined } = require('lodash');
const { default: start } = require('@es-exec/esbuild-plugin-start');

const { commonEsbuild } = require('./common');
const path = require('path');

const DEV_ENVIRONMENT_VARIABLES = {
  // overridable
  IS_TEST_RUN: isUndefined(process.env.IS_TEST_RUN)
    ? '0'
    : process.env.IS_TEST_RUN,
  ...process.env,
  // non-overridable
  NODE_ENV: 'development',
  IS_DEVELOPMENT: '1',
  DISABLE_LOGGING: '1',
};

(async () => {
  const ctx = await esbuild.context({
    ...commonEsbuild,
    plugins: [
      ...(commonEsbuild.plugins || []),
      start({
        env: DEV_ENVIRONMENT_VARIABLES,
        script: 'node dist/server.js',
      }),
    ],
  });

  await ctx.watch();
  await ctx.serve({
    servedir: path.resolve(__dirname, '../../dist'),
    port: 3002,
  });
})();
