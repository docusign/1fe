import { memoize } from 'lodash';
import { fetchWithTimeout } from './network';
import { getKnownUris } from './getKnownUris';
import { LiveVersions } from '../types/version';
import { getLogger } from '../getLogger';
import chalk from 'chalk';

/**
 *
 * @param environment
 * @param shouldSkipCache ignores caching behavior
 * @returns LiveVersions
 *
 * Fetches information from the /version endpoint of the environment or prod by default.
 */
export const fetchLiveVersions = memoize(async (environment: string) => {
  const logger = getLogger('[cli][version][fetch]');
  const versionUrl = (await getKnownUris(environment)).version;

  try {
    const res = await fetchWithTimeout(versionUrl);

    const liveVersions: LiveVersions = await res.json();

    logger.info(
      `Successfully fetched live versions from ${chalk.blue(versionUrl)}`,
    );

    return liveVersions;
  } catch (error) {
    logger.error(versionUrl, error);
    throw Error('Failed to fetch versions');
  }
});
