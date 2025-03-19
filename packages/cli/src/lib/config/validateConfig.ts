import { getLogger } from '../get-logger';
import {
  baseConfigSchema,
  OneFeConfiguration,
  onefeConfigurationSchema,
} from './config.types';

export async function validateConfig(
  config: OneFeConfiguration,
): Promise<OneFeConfiguration> {
  const logger = getLogger('[validate-config]');

  const baseConfigValidationResult = baseConfigSchema.safeParse(
    config.baseConfig,
  );

  if (baseConfigValidationResult.error) {
    logger.error(
      'Error validating your base configuration:',
      baseConfigValidationResult.error,
    );

    throw baseConfigValidationResult.error;
  }

  const configValidationResult = onefeConfigurationSchema.safeParse(config);

  if (configValidationResult.error) {
    logger.error(
      'Error validating your configuration:',
      configValidationResult.error,
    );

    throw configValidationResult.error;
  }

  return config;
}
