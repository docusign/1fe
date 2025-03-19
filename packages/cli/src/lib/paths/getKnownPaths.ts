import { memoize } from 'lodash';
import { join, resolve } from 'path/posix';

export const getKnownPaths = memoize(function getPathsRaw(
  projectDir = process.cwd(),
) {
  const reportsDir = join(projectDir, 'reports');
  const srcDir = join(projectDir, 'src');

  return {
    projectDir,
    reportsDir,
    srcDir,

    distDir: join(projectDir, 'dist'),

    oneFeConfig: resolve(projectDir, '.1fe.config.ts'),
    tsconfig: resolve(projectDir, 'tsconfig.json'),
    packageJson: resolve(projectDir, 'package.json'),

    /**
     * Some of the paths we need to use point to files that
     * do not exist in the file system. Put all such paths here.
     */
    virtual: {
      apiExtractorConfig: join(projectDir, 'api-extractor.json'),
    },

    variants: {
      configsGlob: resolve(srcDir, 'variants', '*', '.1fe.variant.config.ts'),
      variantsEntry: resolve(srcDir, 'variantsEntry.ts'),
      getVariantIndex(variantDirName: string) {
        return resolve(srcDir, 'variants', variantDirName, 'variant.ts');
      },
    },

    scenesEntry: resolve(srcDir, join('scenes', 'index.ts')),

    webpack: {
      analyzerPlugin: {
        statsJson: join(reportsDir, 'bundle-stats.json'),
        reportHtml: join(reportsDir, 'bundle-report.html'),
      },
      widgetEntry: resolve(srcDir, 'widget.ts'),
    },

    contracts: {
      installDir: resolve(srcDir, 'types'),
      widgetsDir: resolve(srcDir, join('types', 'widgets')),
      indexDTs: resolve(srcDir, join('types', 'index.d.ts')),
    },
  };
});
