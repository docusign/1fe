import { getConfig } from './getConfig';

export async function parseEnv(envValue: string) {
  const { baseConfig } = await getConfig();
  if (!baseConfig.environments[envValue]) {
    throw new Error(
      `No base configuration found for environment "${envValue}". Are you sure you have the correct --environment ?`,
    );
  }
  return envValue;
}
