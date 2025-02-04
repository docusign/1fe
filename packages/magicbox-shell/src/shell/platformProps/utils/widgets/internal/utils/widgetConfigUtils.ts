import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../../magicbox-server/src/server/utils/widget-config-helpers';
// import {
//   WIDGET_CONFIGS,
//   getEnvironmentConfigs,
//   injectPreloadTags,
//   isShellWidget,
// } from '../../../../../utils';
// import { isWidgetTypePinned } from '../../../../../../isomorphic/widgetConfigs/widgetType';
import { WidgetConfig } from '../../../../../types/widget-config';
import { isShellWidget, isWidgetTypePinned } from '../../../../../utils/widget-type';
import { WIDGET_CONFIGS } from '../../../../../configs/config-helpers';
import { injectPreloadTags } from '../../../../../utils/dom-helpers';
import { getWidgetBundleCdnUrl } from '../../../../../utils/url';

/**
 * Queue preloads for the API fetch GET calls and dependent child widgets if found in the requested widget's runtime config.
 * This is done dynamically at runtime to reduce the initial load time of the widget's depdendencies on other widgets.
 *
 * @param hostWidget The requestor/host/parent widget config
 * @param requestedWidgetConfig Widget config of a widget declared in their .1ds.config.ts runtime section
 */
export const queueWidgetPreloadsIfFound = (
  hostWidget: WidgetConfig,
  requestedWidgetConfig: WidgetConfig,
): void => {
  // Do not handle preloads if the host widget is a shell widget.
  // aka the requestedWidget is a Plugin
  // Because the Server HTML embeds will handle the preloads for the Plugin.
  // Plugin preloads are handled in: src/controllers/data/index.ts:102
  if (isShellWidget(hostWidget.widgetId)) {
    return;
  }

  const preloadArr = requestedWidgetConfig.runtime?.preload || [];

  const preloadWidgetArr = preloadArr
    .map((preload) => preload.widget)
    .filter((e) => e) as string[];

  // API fetch GET calls to preload
  const preloadAPIGetArr = preloadArr
    .map((preload) => preload.apiGet)
    .filter((e) => e) as string[];

  const widgetURLsToPreload = preloadWidgetArr?.reduce(
    (itr: URL[], preloadedWidgetId: string) => {
      const preloadedWidgetConfig = WIDGET_CONFIGS.get(preloadedWidgetId);

      if (!preloadedWidgetConfig) {
        return itr;
      }

      const { requestedWidgetConfig: widgetConfigPreloadedByRequestedWidget } =
        getRequestedWidgetConfigWithoutRuntimeConfig({
          hostWidgetId: requestedWidgetConfig.widgetId,
          requestedWidgetId: preloadedWidgetConfig.widgetId,
          widgetConfigs: WIDGET_CONFIGS,
        });

      const requestedWidgetConfigBundleCdnUrl = getWidgetBundleCdnUrl({
        widgetId: widgetConfigPreloadedByRequestedWidget.widgetId,
        version: widgetConfigPreloadedByRequestedWidget.version,
      });

      return [...itr, new URL(requestedWidgetConfigBundleCdnUrl)];
    },
    [] as URL[],
  );

  if (widgetURLsToPreload.length) {
    injectPreloadTags(
      widgetURLsToPreload.map((url: URL) => url.toString()),
      'script',
    );
  }

  if (preloadAPIGetArr.length) {
    injectPreloadTags(preloadAPIGetArr, 'fetch');
  }
};

export const getRequestedWidgetVersionForConsole = (
  hostWidgetId: string,
  widgetRequest: WidgetConfig | URL | undefined,
) => {
  if (!widgetRequest) {
    return 'widgetRequest undefined';
  }

  if (!('version' in widgetRequest)) {
    return widgetRequest;
  }

  const { type } = getRequestedWidgetConfigWithoutRuntimeConfig({
    hostWidgetId,
    requestedWidgetId: widgetRequest.widgetId,
    widgetConfigs: WIDGET_CONFIGS,
  });

  const version = isWidgetTypePinned(type)
    ? `${widgetRequest.version} (pinned)`
    : widgetRequest.version;

  const importMapOverrides =
    window.importMapOverrides?.getOverrideMap()?.imports || {};

  return importMapOverrides[widgetRequest.widgetId] ? 'overridden' : version;
};
