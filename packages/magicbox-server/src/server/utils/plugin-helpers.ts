import { PluginConfig } from "../types";
import { getCachedWidgetConfigs } from "./widget-config";
import { getWidgetConfigValues } from "./widget-config-helpers";

/**
 * [Server Side Only Util] Return plugin baseline url from in-memory widget runtime config; default to 1ds-config if not found
 * @param pluginConfig widget's plugin config
 * @returns plugin baseline url
 */
export const getPluginBaselineUrl = (pluginConfig: PluginConfig) => {
    const runtimePluginBaselineUrl = getCachedWidgetConfigs().get(
    pluginConfig.widgetId,
    )?.runtime?.plugin?.baselineUrl;
    const baselineUrl = runtimePluginBaselineUrl || pluginConfig?.baselineUrl;

    return baselineUrl;
  };

  export const getPlugin = async (
    path: string,
  ): Promise<PluginConfig | undefined> => {
    const widgetConfigs = getCachedWidgetConfigs();
  
    const widgetFound = getWidgetConfigValues(widgetConfigs)?.find((widget) => {
      const normalizedPath = new URL(path, 'https://placeholder').pathname;
  
      return (
        normalizedPath === widget.plugin?.route ||
        normalizedPath.startsWith(`${widget.plugin?.route}/`)
      );
    });
  
    if (widgetFound?.plugin) {
      return { widgetId: widgetFound.widgetId, ...widgetFound.plugin };
    }
  
    return undefined;
  };

  export const getPluginById = async (
    widgetId: string,
  ): Promise<PluginConfig | undefined> => {
    const widgetConfigs = getCachedWidgetConfigs();
  
    const pluginFound = widgetConfigs.get(widgetId.toLowerCase());
  
    if (pluginFound?.plugin) {
      return { widgetId, ...pluginFound.plugin };
    }
  
    return undefined;
  };
  