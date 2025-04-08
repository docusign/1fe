const esbuild = require('esbuild');
const { commonEsbuild } = require('./common');
// const { nodeConsoleLogger } = require('@1ds/helpers/node');

(async () => {
  const result = await esbuild.build(commonEsbuild);
  console.log(`[SERVER][BUILD] ${JSON.stringify(result)}`);
})();
