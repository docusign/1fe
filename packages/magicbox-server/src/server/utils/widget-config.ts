import { PluginConfig, WidgetConfig, WidgetConfigs } from "../types";

let cachedWidgetConfigs: WidgetConfigs = new Map();

// TODO: move this out as util and reuse. Delete widget-configs implementation
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

export const getCachedWidgetConfigs = (): WidgetConfigs => {
    return cachedWidgetConfigs;
};

export const setCachedWidgetConfigs = (newWidgetconfigs: WidgetConfigs): void => {
    cachedWidgetConfigs = newWidgetconfigs;
};
