import { memoize } from 'lodash';
import { join, resolve } from 'path/posix';

/**
 * Memoized function to retrieve paths for various recognized directories and files.
 */
export const getPaths = memoize(function getPathsRaw(basePath = process.cwd()) {
  const reportsDir = join(basePath, './reports');

  return {
    reportsDir,
    widgetEntry: resolve(basePath, './src/index.ts'),
    tsconfig: resolve(basePath, './tsconfig.json'),
    webpack: {
      analyzerPlugin: {
        statsJson: join(reportsDir, './bundle-stats.json'),
        reportHtml: join(reportsDir, './bundle-report.html'),
      },
    },
  };
});
