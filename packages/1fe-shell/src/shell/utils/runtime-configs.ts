import { WIDGET_CONFIGS } from '../configs/config-helpers';
import { RUNTIME_CONFIG_OVERRIDES } from '../constants/search-params';
import { RuntimeConfig, WidgetConfig } from '../types/widget-config';
import { parseRuntimeConfig } from './parse-runtime-config';

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

/**
 * Use the versioned runtime config for a widget that has been overridden with the widget_url_overrides param
 *
 * @param widgetId
 * @param runtimeConfig
 * @returns
 */
export const overrideWidgetConfigRuntime = (
  widgetId: string,
  runtimeConfig: RuntimeConfig,
) => {
  const widgetConfig = WIDGET_CONFIGS.get(widgetId);

  if (!widgetConfig) {
    // this is expected for libraries or widgetIds with a typo
    console.warn(
      '[1DS][overrideWidgetConfigRuntime] The key for you import map override does not exist in the global WIDGET_CONFIGS map. This could be because of a typo in a widgetId or because you are overriding a library.',
    );
    return;
  }

  (WIDGET_CONFIGS as Map<string, WidgetConfig>).set(widgetId, {
    ...widgetConfig,
    runtime: parseRuntimeConfig({
      runtimeConfig,
      widgetConfig
    }),
  });
};

export const widgetRuntimeConfigUrlFilename = 'widget-runtime-config.json';

export const getRuntimeConfigUrlFromBundleUrl = (bundleUrl: string): string =>
  bundleUrl.replace('js/1ds-bundle.js', widgetRuntimeConfigUrlFilename);
