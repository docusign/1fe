import { copy } from 'esbuild-plugin-copy';
import { defineConfig } from 'tsup';
import { baseConfig } from '../../tsup.config.base';

export default defineConfig({
  ...baseConfig,
  entry: [
    'src/index.ts',

    // required by 1fe-app
    'src/utils/externalsUtils.ts',

    // required by validate-pr command and passed to danger.js to execute
    'src/commands/validate-pr/danger-plugin/dangerfiles/dangerfile-init.ts',
    'src/commands/validate-pr/danger-plugin/dangerfiles/dangerfile-refresh.ts',
    'src/commands/validate-pr/danger-plugin/TempAzureDevopsCIProvider.ts',

    // required for consumers of 1fe to import validate-pr checks for customization
    'src/validate-pr.ts',

    // THIS IS USED BY EDGE WORKER TESTS
    'src/commands/edge-worker/jest.edge-worker.config.ts',
  ],
  format: ['cjs'],
  target: 'es2022',
  shims: true,
  esbuildPlugins: [
    copy({
      // DO NOT REMOVE
      // THIS IS HOW PLUGINS/WIDGETS SHARE THE SAME .browserslistrc
      resolveFrom: 'cwd',
      assets: {
        from: ['.browserslistrc'],
        to: ['./dist/.browserslistrc'],
      },
    }),
  ],
});
