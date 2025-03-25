import { existsSync } from 'fs';
import { memoize } from 'lodash';
import { Configuration as WebpackConfig } from 'webpack';
import { getKnownPaths } from '../../../lib/paths/getKnownPaths';
import { WEBPACK_BUNDLES } from '../webpack.constants';
import { getLogger } from '../../../lib/getLogger';

/**
 * Returns a webpack config object with an entry for `1fer-scenes` pointing to `scenes/index.ts`
 * within the widget project directory when the file exists.
 */
export const getScenesLayer = memoize((): WebpackConfig => {
  const logger = getLogger('[webpack][scenes]');
  const sceneEntryPath = getKnownPaths().scenesEntry;

  if (existsSync(sceneEntryPath)) {
    logger.info('Scenes entry path exists:', sceneEntryPath);
    return {
      entry: {
        [WEBPACK_BUNDLES.SCENES]: sceneEntryPath,
      },
    };
  }

  logger.info('No scenes entry file found at', sceneEntryPath);
  return {};
});
