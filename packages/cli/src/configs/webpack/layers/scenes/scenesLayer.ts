import { existsSync } from 'fs';
import { memoize } from 'lodash';
import { Configuration as WebpackConfig } from 'webpack';
import { getKnownPaths } from '../../../../lib/paths/getKnownPaths';
import { WEBPACK_BUNDLES } from '../../webpack.constants';

/**
 * Returns a webpack config object with an entry for `1fer-scenes` pointing to `scenes/index.ts`
 * within the widget project directory when the file exists.
 */
export const getScenesLayer = memoize((): WebpackConfig => {
  const sceneEntryPath = getKnownPaths().scenesEntry;

  if (existsSync(sceneEntryPath)) {
    return {
      entry: {
        [WEBPACK_BUNDLES.SCENES]: sceneEntryPath,
      },
    };
  }

  return {};
});
