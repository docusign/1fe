import { getLogger } from '../getLogger';
import { fetchWithTimeout } from '../network/network';
import { variantsPathSuffix } from './constants';
// import { getCliTraceConsoleLogger } from '../cliTraceConsoleLogger';
import { WidgetId } from './types';

/**
 * Get the list of variants used by the widget from the CDN
 * @param baseUrl Your widget's base url for the CDN
 * @param widgetId The Id of the widget
 * @returns The variantIds of the widget
 */
export const getWidgetCdnVariants = async (
  baseUrl: string,
  widgetId: WidgetId,
): Promise<string[]> => {
  const logger = getLogger('[contract]');
  try {
    const variantsUrl = `${baseUrl}${variantsPathSuffix}`;
    const response = await fetchWithTimeout(variantsUrl);
    if (!response.ok) {
      throw new Error(`Unable to fetch variants from ${variantsUrl}`);
    }
    const variants: string[] = await response.json();
    logger.info(`[${widgetId}] Variants found:${variants.join(', ')}`);
    return variants;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`${error.message}`);
    return [];
  }
};
