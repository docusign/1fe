import { getLogger } from '../getLogger';
import { fromError } from 'zod-validation-error';
import { OneFeConfiguration, onefeConfigurationSchema } from './config.types';

export async function validateConfig(
  config: OneFeConfiguration,
): Promise<OneFeConfiguration> {
  const logger = getLogger('[validate-config]');

  logger.info(
    'Validating configuration\n\n',
    JSON.stringify(config, null, 2),
    '\n',
  );

  try {
    onefeConfigurationSchema.parse(config);
  } catch (error) {
    logger.error(
      'Error validating your configuration:',
      fromError(error).toString(),
    );

    process.exit(1);
  }

  return config;
}
