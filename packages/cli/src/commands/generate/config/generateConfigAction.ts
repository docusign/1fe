import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { getConfig } from 'src/lib/config/getConfig';
import { getLogger } from 'src/lib/getLogger';
import { getKnownPaths } from 'src/lib/paths/getKnownPaths';
import { oneFeProgram } from 'src/oneFeProgram/oneFeProgram';
import { GenerateCommandOptions } from './generateConfigCommand.types';

export async function generateConfigAction({ outDir }: GenerateCommandOptions) {
  const logger = getLogger('[generate][config]');

  const environment = await oneFeProgram.getOptionValue('environment');
  const oneFeConfig = await getConfig();
  const runtimeConfigPath =
    getKnownPaths().getWidgetRuntimeConfigJsonPath(outDir);

  try {
    const runtimeEnvironmentConfig =
      oneFeConfig.runtimeConfig?.[environment] || {};

    writeFileSync(runtimeConfigPath, JSON.stringify(runtimeEnvironmentConfig));

    logger.log(
      `Successfully saved runtime config to disk at ${chalk.green(runtimeConfigPath)}`,
    );
  } catch (error) {
    logger.error('Failed to generate config', error);
  }

  logger.log('Generating 1fe config file in the current directory.');
}
