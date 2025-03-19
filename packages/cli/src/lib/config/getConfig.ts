import { getKnownPaths } from '../paths/getKnownPaths';
import { validateConfig } from './validateConfig';
import { getLogger } from '../getLogger';
import { loadTsDefault } from '../loadTs';
import ky from 'ky';
import { memoize } from 'lodash';
import { OneFeConfiguration } from '../..';
import {
  OneFeConfigurationObject,
  OneFeBaseConfiguration,
} from './config.types';

export async function getConfig(): Promise<OneFeConfigurationObject> {
  const logger = getLogger('[get-config]');
  try {
    const config: OneFeConfiguration = await loadTsDefault(
      getKnownPaths().oneFeConfig,
      {
        useCache: false,
      },
    );

    if (typeof config.baseConfig === 'string') {
      config.baseConfig = await ky
        .get(config.baseConfig)
        .json<OneFeBaseConfiguration>();
    } else if (typeof config.baseConfig === 'function') {
      config.baseConfig = await config.baseConfig();
    }

    return validateConfig(config as OneFeConfigurationObject);
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

  return baseConfig.environments[environment].commonConfig;
});
