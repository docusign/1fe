import { Configuration as WebpackConfig } from 'webpack';
import { getDynamicConfigs } from '../../../lib/config/getDynamicConfigs';
import { getLogger } from '../../../lib/getLogger';
import chalk from 'chalk';

export async function getTargetLayer(
  environment: string,
): Promise<WebpackConfig> {
  const logger = getLogger('[webpack][target]');

  const browsersListRules = (
    await getDynamicConfigs(environment)
  ).platform.browserslistConfig.join();

  logger.info('Using browserslist config:', chalk.blue(browsersListRules));

  return {
    target: `browserslist:${browsersListRules}`,
  };
}
