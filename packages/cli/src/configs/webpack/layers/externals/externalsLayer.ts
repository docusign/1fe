import { Configuration as WebpackConfig } from 'webpack';
import { getCommonConfigs } from '../../../../lib/config/getConfig';

export async function getExternalsLayer(
  environment: string,
): Promise<WebpackConfig> {
  const commonConfig = await getCommonConfigs(environment);

  const externals = commonConfig.cdn.libraries.managed
    .filter((lib) => lib.type === 'external')
    .map((lib) => ({
      [lib.id]: lib.name,
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  return {
    externals,
  };
}
