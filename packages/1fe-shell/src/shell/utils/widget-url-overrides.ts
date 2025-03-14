import { WIDGET_URL_OVERRIDES } from '../constants/search-params';

/**
 * Get the parsed runtime config overrides from the query param
 */
export const getParsedWidgetUrlOverrides = (): Record<string, string> => {
  try {
    const param = new URL(window.location.href).searchParams.get(
      WIDGET_URL_OVERRIDES,
    );

    return param ? JSON.parse(param) : {};
  } catch (e) {
    console.error(
      `[1FE][RUNTIME_CONFIG_OVERRIDES] Unable to parse JSON in ${WIDGET_URL_OVERRIDES} param`,
    );

    return {};
  }
};

export const isAllowedSource = (
  source: string,
  allowedSources: string[],
): boolean => {
  try {
    const sourceUrl = new URL(source);
    return allowedSources.includes(sourceUrl.hostname);
  } catch {}

  return false;
};
