// import { nodeConsoleLogger } from '@1ds/helpers/node';
// import { getCliTraceConsoleLogger } from './cliTraceConsoleLogger';

import { getLogger } from '../getLogger';

const REQUEST_TIMEOUT = 5000;

/**
 * Fetch with retry.
 * @example fetchWithTimeout('https://example.com', { method: 'GET' }, 8)
 * @param {string} url url to fetch
 * @param {object} options fetch options
 * @param {number} retries? number of retries
 * @returns
 */
export const fetchWithTimeout = async (
  url: string,
  options?: RequestInit,
  retries = 8,
): Promise<globalThis.Response> => {
  const logger = getLogger('[cli][network]');
  logger.info(
    `[CLI][NETWORK] Calling ${url} with timeout ${REQUEST_TIMEOUT} and retries left ${retries}`,
  );

  const controller = new AbortController();
  const id = setTimeout(() => {
    logger.warn('[CLI][NETWORK] Timed out.');
    controller.abort();
  }, REQUEST_TIMEOUT);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  })
    .catch((err) => {
      if (retries > 0) {
        logger.warn(`[CLI][NETWORK] Network error. Retries left: ${retries}`);
        return fetchWithTimeout(url, options, retries - 1);
      }

      logger.error(
        `[CLI][NETWORK] Failed to fetch: ${url} after all retries.`,
        err,
      );

      throw err;
    })
    .finally(() => clearTimeout(id));
};
