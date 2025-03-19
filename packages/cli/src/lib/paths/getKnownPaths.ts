import { memoize } from 'lodash';
import { join, resolve } from 'path/posix';

export const getKnownPaths = memoize(function getPathsRaw(
  basePath = process.cwd(),
) {
  const reportsDir = join(basePath, 'reports');
  const srcDir = join(basePath, 'src');

  return {
    config: resolve(basePath, '.1fe.config.ts'),
    tsconfig: resolve(basePath, 'tsconfig.json'),

    reportsDir,

    webpack: {
      analyzerPlugin: {
        statsJson: join(reportsDir, 'bundle-stats.json'),
        reportHtml: join(reportsDir, 'bundle-report.html'),
      },
      widgetEntry: resolve(srcDir, 'widget.ts'),
      scenesEntry: resolve(srcDir, 'scenes/index.ts'),
    },

    contracts: {
      installDir: resolve(srcDir, 'types'),
      widgetsDir: resolve(srcDir, join('types', 'widgets')),
      indexDTs: resolve(srcDir, join('types', 'index.d.ts')),
    },
  };
});
