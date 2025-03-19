import ejs from 'ejs';
import { sync } from 'globby';
import { Configuration as WebpackConfig } from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import { OneFeVariantConfig } from '../../../../lib/config/variantConfig.types';
import { getLogger } from '../../../../lib/getLogger';
import { getKnownPaths } from '../../../../lib/paths/getKnownPaths';
import { getWidgetPackageJson } from '../../../../lib/getWidgetPackageJson';
import variantsEntryTemplate from './variantsEntry.ts.ejs';
import {
  getFileNameWithoutExtension,
  getParentDirectoryName,
} from '../../../../lib/paths/pathHelpers';
import { WEBPACK_BUNDLES } from '../../webpack.constants';
import { loadTsDefault } from '../../../../lib/loadTs';

export async function getVariantsEntryLayer(): Promise<WebpackConfig> {
  const logger = getLogger('[webpack][variants]');

  const configFiles = sync(getKnownPaths().variants.configsGlob);
  if (!configFiles.length) {
    logger.info('No variant configs found');
    return {};
  }

  const widgetPackageJson = await getWidgetPackageJson();
  const configs: Array<
    Omit<OneFeVariantConfig, 'schema-version'> & {
      variantIndexFilePathNoExtension: string;
    }
  > = [];

  for (const configFile of configFiles) {
    logger.info(`Found variant config: ${configFile}`);

    try {
      const variantConfig: OneFeVariantConfig = await loadTsDefault(configFile);
      logger.info(`Loaded variant config for ${variantConfig.variantId}`);

      const variantDirName = getParentDirectoryName(configFile);

      configs.push({
        ...variantConfig,
        variantIndexFilePathNoExtension: getFileNameWithoutExtension(
          getKnownPaths().variants.getVariantIndex(variantDirName),
        ),
      });
    } catch (e) {
      logger.error(`Failed to load variant config: ${configFile}`, e);
      process.exit(1);
    }
  }

  try {
    const variantsEntryFileContent = ejs.render(variantsEntryTemplate, {
      configs,
      widgetId: widgetPackageJson.name,
    });

    // The virtual module plugin will add the variants entry file to the webpack build without writing it to disk.
    const virtualModulePlugin = new VirtualModulesPlugin({
      [getKnownPaths().variants.variantsEntry]: variantsEntryFileContent,
    });

    return {
      plugins: [virtualModulePlugin],
      entry: {
        [WEBPACK_BUNDLES.MAIN]: [getKnownPaths().variants.variantsEntry],
      },
    };
  } catch (e) {
    logger.error(
      `Failed to render variant entry for widget "${widgetPackageJson.name}"`,
      e,
    );
    process.exit(1);
  }
}
