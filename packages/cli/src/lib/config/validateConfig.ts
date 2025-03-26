import { getLogger } from '../getLogger';
import { fromError } from 'zod-validation-error';
import { onefeConfigurationSchema } from './configSchema';
import { OneFeConfigurationObject } from './config.types';

export async function validateConfig(
  config: OneFeConfigurationObject,
): Promise<OneFeConfigurationObject> {
  const logger = getLogger('[config][validate]');

  logger.debug(
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
