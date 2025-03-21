import { Configuration as WebpackConfig } from 'webpack';
import { getCommonConfigs } from '../../../../lib/config/getCommonConfigs';
import { getLogger } from '../../../../lib/getLogger';
import chalk from 'chalk';

export async function getTargetLayer(
  environment: string,
): Promise<WebpackConfig> {
  const logger = getLogger('[webpack][target]');

  const browsersListRules = (
    await getCommonConfigs(environment)
  ).browserslistConfig.join();

  logger.info('Using browserslist config:', chalk.blue(browsersListRules));

  return {
    target: `browserslist:${browsersListRules}`,
  };
}
