import { DYNAMIC_CONFIGS, WIDGET_CONFIGS } from "../configs/config-helpers";
import { LOCAL_STORAGE_KEY_PREFIXES } from "../constants/local-storage-keys";
import { getParsedRuntimeConfigOverrides, getRuntimeConfigUrlFromBundleUrl, overrideWidgetConfigRuntime } from "../utils/runtime-configs";
import { getShellPlatformUtils } from "../utils/shell-platform-utils";
import { getParsedWidgetUrlOverrides, isAllowedSource } from "../utils/widget-url-overrides";

/**
 * The "current" runtime config for any environment can be replaced in two ways:
 * 1. By passing the runtime_config_overrides query param. This is usually done automatically by `yarn 1ds-cli dev --overrideRuntimeConfig`
 * 2. When the widget_url_overrides param is detected, the server and client will use the corresponding runtime config if the url override is a docusign cdn
 *
 * This function is the client side of #2. The server will override the runtime config before returning the index.html and then it is managed in localStorage
 * because the widget_url_overrides param does not persist on navigation.
 *
 * @returns void
 */
export const applyRuntimeConfigOverridesForWidgetUrlOverrides = () => {
    const { localStorage } = getShellPlatformUtils();
    const runtimeConfigOverrides = getParsedRuntimeConfigOverrides();
    const parsedWidgetUrlOverrides = getParsedWidgetUrlOverrides();
  
    const importMapOverrides =
      window.importMapOverrides?.getOverrideMap()?.imports || {};
  
    Object.entries(importMapOverrides)
      .filter(
        ([widgetId, url]) =>
          isAllowedSource(url, DYNAMIC_CONFIGS.importMapOverrides.allowedSources) &&
          !runtimeConfigOverrides[widgetId] && // runtime_config_overrides param should take precedence over widget_url_overrides/importMap
          WIDGET_CONFIGS.get(widgetId), // exclude non-widget overrides, e.g. @ds/ui
      )
      .forEach(([widgetId]) => {
        // The widget was in the widget_url_overrides param, therefore
        // the server applied the runtime config override before returning the index.html
        //
        // Store the runtime config in local storage so that it can be applied later
        if (importMapOverrides[widgetId] && parsedWidgetUrlOverrides[widgetId]) {
          localStorage.set(
            `${LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride}${widgetId}`,
            JSON.stringify(WIDGET_CONFIGS.get(widgetId)?.runtime),
          );
          return;
        }
  
        try {
          // The import map override is missing from the url, therefore
          // the server did NOT apply the runtime config override before returning the index.html
          //
          // Apply the runtime config override that was saved in the step above
  
          if (
            localStorage.get(
              `${LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride}${widgetId}`,
            )
          ) {
            overrideWidgetConfigRuntime(
              widgetId,
              JSON.parse(
                localStorage.get(
                  `${LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride}${widgetId}`,
                ),
              ),
            );
          }
        } catch (error: any) {
          console.error(
            `[1DS] Failed to apply runtime config override for widget ${widgetId}`,
            error,
          );
        }
      });
  
    // Clean up old runtime config overrides that are not being used
    localStorage
      .keys()
      .filter((key) =>
        key.startsWith(LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride),
      )
      .forEach((key) => {
        const widgetId = key.replace(
          LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride,
          '',
        );
  
        if (!importMapOverrides[widgetId]) {
          localStorage.remove(key);
        }
      });
  };
  
  /**
   * Where applyRuntimeConfigOverridesForWidgetUrlOverrides passively overrides runtime configs
   * based on the widget_url_overrides param, this function actively fetches the runtime config
   * when a developer uses the import map button.
   *
   * This fires when the import map changes in any way via the import-map-overrides:change event.
   * This event has not details so we must estimate what changed.
   *
   * @returns Promise<void>
   */
  export const applyRuntimeConfigOverrideForImportMapUi = async () => {
    const importMapOverrides = window.importMapOverrides?.getOverrideMap() || {};
  
    const { localStorage } = getShellPlatformUtils();
    const currentRuntimeConfigOverrides = localStorage
      .keys()
      .filter((key) =>
        key.startsWith(LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride),
      )
      .map((key) =>
        key.replace(LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride, ''),
      );
  
    // estimation for what override was just added manually with the ui
    const widgetUrlOverridesMissingFromLocalStorage = Object.keys(
      importMapOverrides.imports as Record<string, string>,
    ).filter(
      (widgetId) =>
        !currentRuntimeConfigOverrides.includes(widgetId) &&
        WIDGET_CONFIGS.get(widgetId), // exclude non-widget overrides, e.g. @ds/ui
    );
  
    const runtimeConfigFetches = widgetUrlOverridesMissingFromLocalStorage.map(
      async (widgetId) => {
        const widgetUrlOverride = (importMapOverrides.imports || {})[widgetId];
        if (
          !isAllowedSource(widgetUrlOverride, DYNAMIC_CONFIGS.importMapOverrides.allowedSources) ||
          !widgetUrlOverride?.endsWith('/js/1ds-bundle.js')
        ) {
          return;
        }
  
        // get the runtime config that was published for this version of the widget
        const runtimeConfigUrl =
          getRuntimeConfigUrlFromBundleUrl(widgetUrlOverride);
  
        try {
          const response = await fetch(runtimeConfigUrl);
          const runtimeConfig = await response.json();
  
          overrideWidgetConfigRuntime(widgetId, runtimeConfig);
          localStorage.set(
            `${LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride}${widgetId}`,
            JSON.stringify(runtimeConfig),
          );
        } catch (error) {
          console.error(
            `[1DS] Failed to fetch runtime config for widget ${widgetId} from ${runtimeConfigUrl}`,
            error,
          );
        }
      },
    );
  
    await Promise.allSettled(runtimeConfigFetches);
  
    // Clean up old runtime config overrides that are not being used
    localStorage
      .keys()
      .filter((key) =>
        key.startsWith(LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride),
      )
      .forEach((key) => {
        const widgetId = key.replace(
          LOCAL_STORAGE_KEY_PREFIXES.runtimeConfigOverride,
          '',
        );
  
        if (!importMapOverrides.imports?.[widgetId]) {
          localStorage.remove(key);
        }
      });
  };