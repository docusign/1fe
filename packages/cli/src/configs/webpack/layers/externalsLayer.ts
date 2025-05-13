import { Configuration as WebpackConfig } from 'webpack';
import { getCommonConfigs } from '../../../lib/config/getCommonConfigs';
import { getLogger } from '../../../lib/getLogger';

export async function getExternalsLayer(
  environment: string,
): Promise<WebpackConfig> {
  const logger = getLogger('[webpack][externals]');
  const commonConfig = await getCommonConfigs(environment);

  const externals = commonConfig.cdn.libraries.managed
    .filter((lib) => lib.type === 'external')
    .map((lib) => ({
      [lib.id]: lib.name,
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  // TODO - get 1fe-shell external defined within the commonConfig [fast-follow]
  externals['@1fe/shell'] = '1feContext';

  logger.debug('Using externals:', externals);

  return {
    externals,
  };
}
