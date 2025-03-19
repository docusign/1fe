import { getKnownPaths } from '../paths/getKnownPaths';
import { load } from 'ts-import';
import { getLogger } from '../get-logger';
import { validateConfig } from './validateConfig';
import { OneFeBaseConfigObject } from './config.types';

export async function getConfig() {
  const logger = getLogger('[get-config]');
  try {
    const config = await load(getKnownPaths().config);

    if (typeof config.baseConfig === 'string') {
      config.baseConfig = await require(config.baseConfig);
    } else if (typeof config.baseConfig === 'function') {
      config.baseConfig = await config.baseConfig();
    } else if (typeof config.baseConfig === 'object') {
      config.baseConfig = config.baseConfig;
    }

    return validateConfig(config);
  } catch (error) {
    logger.error('Error loading config file:', error);
    process.exit(1);
  }
}

export async function getBaseConfig() {
  return (await getConfig()).baseConfig as OneFeBaseConfigObject;
}
