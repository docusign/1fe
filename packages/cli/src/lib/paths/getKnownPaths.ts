import { memoize } from 'lodash';
import { join, resolve } from 'path';

/**
 * This is one place to find all paths used in the cli for any reason.
 * This is useful to monitor all files that are important for the CLI to function in one single place
 * and to have the flexibility to change the paths in one place if and when needed.
 */

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
    widgetPackageJson: resolve(projectDir, 'package.json'),

    getWidgetRuntimeConfigJsonPath(outDir: string) {
      return resolve(outDir, 'widget-runtime-config.json');
    },

    /**
     * Some of the paths we need to use point to files that
     * do not exist in the file system. Put all such paths here.
     */
    virtual: {
      apiExtractorConfig: join(projectDir, 'api-extractor.json'),
      variantsEntry: resolve(srcDir, 'variantsEntry.ts'),
    },

    variants: {
      configsGlob: resolve(srcDir, 'variants', '*', '.1fe.variant.config.ts'),
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
