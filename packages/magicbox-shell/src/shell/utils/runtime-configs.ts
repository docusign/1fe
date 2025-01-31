import { RUNTIME_CONFIG_OVERRIDES } from '../constants/search-params';
import { RuntimeConfig } from '../types/widget-config';

/**
 * Clears the runtime_config_overrides query param and reloads the page.
 *
 * note: some runtime config overrides may persist if the widget_url_overrides param is also being used.
 */
export const clearRuntimeConfigOverrides = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete(RUNTIME_CONFIG_OVERRIDES);

  window.location.href = url.toString();
};

/**
 * Get the parsed runtime config overrides from the query param
 */
export const getParsedRuntimeConfigOverrides = (): Record<
  string,
  RuntimeConfig
> => {
  try {
    const param = new URL(window.location.href).searchParams.get(
      RUNTIME_CONFIG_OVERRIDES,
    );

    return param ? JSON.parse(param) : {};
  } catch (e) {
    console.error(
      `[1DS][RUNTIME_CONFIG_OVERRIDES] Unable to parse JSON in ${RUNTIME_CONFIG_OVERRIDES} param`,
    );

    return {};
  }
};
