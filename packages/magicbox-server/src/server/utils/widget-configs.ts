import { PluginConfig, WidgetConfig, WidgetConfigs } from "../types";

export const getWidgetConfigValues = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  widgetConfigs: WidgetConfigs<T>,
): T[] => Array.from(widgetConfigs.values());

export const getCachedWidgetConfigs = (): WidgetConfigs => {
    const widgetMap = new Map();
    widgetMap.set('@1ds/widget-starter-kit', {
      "widgetId": "@1ds/widget-starter-kit",
      "plugin": {
      "enabled": true,
      "route": "/starter-kit"
      },
      "version": "1.0.432",
      "activePhasedDeployment": false,
      "runtime": {
      "dependsOn": {
      "widgets": [
      {
      "widgetId": "@internal/generic-child-widget"
      },
      {
      "widgetId": "@1ds/error"
      }
      ]
      },
      "preload": [
      {
      "apiGet": "/version"
      }
      ]
      }
      });
      return widgetMap;
}