import { templatizeCDNUrl } from '../controllers/version.controller';
import { WidgetConfig, WidgetConfigs } from '../types';
import { getRequestedWidgetConfigWithoutRuntimeConfig } from './widget-config-helpers';

type GetPluginPreloadApiUrlsArg = {
  widgetConfigs: WidgetConfigs;
  pluginId: string | undefined;
};

type GetPluginPreloadUrlsArg = {
  widgetConfigs: WidgetConfigs;
  pluginId: string | undefined;
};

const generateCDNUrl = (widget: WidgetConfig): URL => {
  return templatizeCDNUrl({
    widgetId: widget.widgetId,
    widgetVersion: widget.version,
  });
};

/**
 * Get the api urls to preload for the given plugin
 *
 * @param arg.widgetConfigs cached widget configs
 * @param arg.pluginId widgetId for the plugin being rendered
 *
 * @returns array of api urls to preload for the plugin
 */
export const getPluginPreloadApiUrls = ({
  widgetConfigs,
  pluginId,
}: GetPluginPreloadApiUrlsArg): string[] => {
  if (!pluginId) {
    return [];
  }

  const pluginConfig = widgetConfigs.get(pluginId);

  if (!pluginConfig) {
    return [];
  }

  const result = (pluginConfig.runtime?.preload
    ?.map((preloadConfig) => preloadConfig.apiGet)
    .filter((url) => url) || []) as string[];

  return result;
};

/**
 * Get the url for preload script tags included in the index.html for the given plugin.
 *
 * @param arg.envConfig env data passed to the client
 * @param arg.widgetConfigs cached widget configs
 * @param arg.pluginId widgetId for the plugin being rendered
 *
 * @returns array of asset urls to preload for the plugin
 */
export const getPluginPreloadAssetUrls = ({
  widgetConfigs,
  pluginId,
}: GetPluginPreloadUrlsArg): string[] => {
  if (!pluginId) {
    return [];
  }

  const pluginConfig = widgetConfigs.get(pluginId);

  if (!pluginConfig) {
    return [];
  }

  const preloadUrls =
    pluginConfig?.runtime?.preload
      ?.map((e) => e.widget)
      ?.filter((e) => e)
      ?.map((preloadedWidgetId) => {
        if (preloadedWidgetId) {
          const { requestedWidgetConfig } =
            getRequestedWidgetConfigWithoutRuntimeConfig({
              hostWidgetId: pluginId,
              requestedWidgetId: preloadedWidgetId,
              widgetConfigs,
            });

          if (requestedWidgetConfig) {
            return generateCDNUrl(requestedWidgetConfig);
          }
        }

        return '';
      }) || [];

  return [
    // eslint-disable-next-line no-underscore-dangle
    generateCDNUrl(pluginConfig),
    ...preloadUrls,
  ]
    .filter((e) => e)
    .map((e) => e?.toString());
};
