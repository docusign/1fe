import { memoize } from 'lodash';
import { getConfig } from './getConfig';

export const getCommonConfigs = memoize(async (environment: string) => {
  const { baseConfig } = await getConfig();
  if (!baseConfig.environments[environment]) {
    throw new Error(
      `No base configuration found for environment "${environment}"`,
    );
  }

  return baseConfig.environments[environment].commonConfig;
});
