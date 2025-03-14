import { omit } from 'lodash';

import { PluginConfig, WidgetConfig, WidgetConfigs } from '../types';
import { PINNED_WIDGET_TYPE } from '../constants';
import { getCachedWidgetConfigs } from './widget-config';

type GetRequestedWidgetConfigArg = {
  hostWidgetId: string;
  requestedWidgetId: string;
  widgetConfigs: WidgetConfigs;
};

export type WidgetType = 'pinned' | 'system';

// TODO:[1FE consumption] Need to add back INTERNAL_PLUGIN_GATING if we consume back in 1fe

export const getWidgetConfigValues = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  widgetConfigs: WidgetConfigs<T>,
): T[] => Array.from(widgetConfigs.values());

export const generateWidgetConfigMap = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  parsedWidgetConfigData: T[],
): WidgetConfigs<T> =>
  new Map(
    parsedWidgetConfigData.map((widgetConfig) => [
      widgetConfig.widgetId,
      widgetConfig,
    ]),
  );

export const mapAndGenerateWidgetConfigMap = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  widgetConfigs: WidgetConfigs,
  mapCallback: Parameters<typeof Array.prototype.map<T>>[0],
): WidgetConfigs<T> => {
  const values = getWidgetConfigValues(widgetConfigs);
  const mappedValues = values.map(mapCallback);

  return generateWidgetConfigMap(mappedValues);
};

export const isWidgetTypePinned = (widgetType?: WidgetType): boolean =>
  widgetType === PINNED_WIDGET_TYPE;

/**
 * Get all plugin configs for all plugins
 */
export const getPluginConfigs = (): PluginConfig[] => {
  const widgetConfigs = getCachedWidgetConfigs();

  const result = getWidgetConfigValues(widgetConfigs)
    .filter((widget) => {
      return !!widget.plugin;
    })
    .map((widget) => ({
      ...widget.plugin,
      widgetId: widget.widgetId,
    })) as PluginConfig[];

  return result || [];
};

/**
 * Strip out certain keys and values from the widget config before sending to the Shell client
 * This helps keep the HTML payload size down for the client and reduces the amount of data sent
 * Keys added here are ones that are not required for the Shell to handle widget functionality
 *
 * @param widgetConfigs
 * @returns widget config map
 */
export const convertServerWidgetConfigToShellWidgetConfig = (
  widgetConfigs: WidgetConfigs,
): Partial<WidgetConfig>[] => {
  return getWidgetConfigValues(widgetConfigs).map((widget) => {
    // Remove the following paths that are not needed by the 1FE Shell
    // widget.runtime.plugin.metaTags
    return omit(widget, ['runtime.plugin.metaTags', 'runtime.headers.csp']);
  });
};

/**
 * Strip out certain keys and values from the widget config before sending to the Shell client
 * This helps keep the HTML payload size down for the client and reduces the amount of data sent
 * Keys added here are ones that are not required for the Shell to handle widget functionality
 *
 * @param widgetConfigs
 * @returns widget config map
 */
// TODO[1fe]: Strongly type input output
export const convertServerDynamicConfigToShellDynamicConfig = (
  dynamicConfigs: any,
): any => {
  return omit(dynamicConfigs, [
    'cdn.libraries.managed',
    'cdn.widgets.releaseConfig',
    'csp',
  ]);
};

/**
 * exported for unit testing
 */
export const getPinnedWidgets = (
  widgetConfig: WidgetConfig | undefined,
): { widgetId: string; version: string }[] => {
  return widgetConfig?.runtime?.dependsOn?.pinnedWidgets || [];
};

/**
 * This function abstracts all complexity of getting a requested widget config. If the requested widget is pinned by the host widget, it will handle it internally.
 *
 * TODO: ONEDS-2108
 * Enhance this function to fetch the versioned runtime config for a pinned widget. Currently, it only returns pinned widgets with their "current" runtime config + pinned version.
 *
 * @param arg.hostWidgetId host widget id
 * @param arg.requestedWidgetId requested widget id
 * @param arg.widgetConfigs widget configs map
 * @param arg.consoleLogger console logger for the shell or client
 *
 * @returns requested widget config, with the versioned runtime config if the widget is pinned
 */
export const getRequestedWidgetConfigWithoutRuntimeConfig = ({
  hostWidgetId,
  requestedWidgetId,
  widgetConfigs,
}: GetRequestedWidgetConfigArg): {
  requestedWidgetConfig: WidgetConfig;
  type?: typeof PINNED_WIDGET_TYPE;
} => {
  const hostWidgetConfig = widgetConfigs.get(hostWidgetId);
  const requestedWidgetConfig = widgetConfigs.get(requestedWidgetId);

  if (!requestedWidgetConfig) {
    console.error(
      '[1FE][platformProps.utils.widgets.get] Unable to find requested widget config in the global WIDGET_CONFIGS map. Returning empty object.',
      {
        hostWidgetId,
        requestedWidgetId,
      },
    );

    return { requestedWidgetConfig: {} as WidgetConfig };
  }

  // Is the requested widget pinned by the host widget?
  const requestedWidgetPinnedConfig = getPinnedWidgets(hostWidgetConfig).find(
    (pinnedWidget) => pinnedWidget.widgetId === requestedWidgetId,
  );

  if (!!requestedWidgetPinnedConfig) {
    if (!isWidgetTypePinned(requestedWidgetConfig.type)) {
      console.warn(
        '[platformProps.utils.widgets.get][PINNED_WIDGETS] Requested pinned widget is not a pinned widget. The 1fe shell will request the current version instead.',
      );

      return { requestedWidgetConfig };
    }

    return {
      requestedWidgetConfig: {
        ...requestedWidgetConfig,
        version: requestedWidgetPinnedConfig.version,
      },
      type: PINNED_WIDGET_TYPE,
    };
  }

  return { requestedWidgetConfig };
};
