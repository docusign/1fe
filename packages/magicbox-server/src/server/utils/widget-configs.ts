import { PluginConfig, WidgetConfig, WidgetConfigs } from "../types";

export const getWidgetConfigValues = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  widgetConfigs: WidgetConfigs<T>,
): T[] => Array.from(widgetConfigs.values());

export const getCachedWidgetConfigs = (): WidgetConfigs => {
    return new Map();
}