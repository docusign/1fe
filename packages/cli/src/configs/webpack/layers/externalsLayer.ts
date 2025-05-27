import { Configuration as WebpackConfig } from 'webpack';
import { getLogger } from '../../../lib/getLogger';
import { getLibraryVersions } from 'src/lib/config/getLibraryVersions';

export async function getExternalsLayer(
  environment: string,
): Promise<WebpackConfig> {
  const logger = getLogger('[webpack][externals]');
  const libraryVersions = await getLibraryVersions(environment);

  const externals = libraryVersions
    .filter((lib) => lib.type === 'external')
    .map((lib) => ({
      [lib.id]: lib.name,
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  // TODO - get 1fe-shell external defined within the dynamicConfig [fast-follow]
  externals['@1fe/shell'] = '1feContext';

  logger.debug('Using externals:', externals);

  return {
    externals,
  };
}
