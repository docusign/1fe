import { memoize } from 'lodash';
import { getConfig } from './getConfig';

export const getBaseConfigForEnv = memoize(async (environment: string) => {
  const { baseConfig } = await getConfig();
  if (!baseConfig.environments[environment]) {
    throw new Error(
      'No base config found for the specified environment: ' + environment,
    );
  }

  return baseConfig.environments[environment];
});
