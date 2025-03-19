import { getKnownPaths } from '../paths/getKnownPaths';
import { validateConfig } from './validateConfig';
import { OneFeConfiguration } from './config.types';
import { getLogger } from '../getLogger';
import { loadTsDefault } from '../loadTs';
import ky from 'ky';
import { memoize } from 'lodash';
import { CommonConfig } from '../types/commonConfigType';

export async function getConfig() {
  const logger = getLogger('[get-config]');
  try {
    const config: OneFeConfiguration = await loadTsDefault(
      getKnownPaths().oneFeConfig,
      {
        useCache: false,
      },
    );

    return validateConfig(config);
  } catch (error) {
    logger.error('Error loading config file:', error);
    process.exit(1);
  }
}

export const getCommonConfigs = memoize(async (environment: string) => {
  const { baseConfig } = await getConfig();
  if (!baseConfig.environments[environment]) {
    throw new Error(
      `No base configuration found for environment "${environment}"`,
    );
  }

  const commonConfig: CommonConfig = await ky
    .get(baseConfig.environments[environment].commonConfigsUrl)
    .json();

  return commonConfig;
});
