import { ProcessedWidgetConfig } from '../../types/processed-dynamic-configs';
import {
  OneFEDynamicConfigs,
  WidgetVersion,
} from '../../types/raw-cdn-configs';

export const generateWidgetConfigs = (
  dynamicConfigs: OneFEDynamicConfigs,
  widgetVersions: WidgetVersion[],
): ProcessedWidgetConfig[] => {
  return widgetVersions.map((widget) => {
    const config = dynamicConfigs.widgets.configs.find(
      (w) => w.widgetId === widget.widgetId,
    );

    if (!config) {
      throw new Error(`Widget config not found for id: ${widget.widgetId}`);
    }

    return {
      ...config,
      version: widget.version,
    };
  });
};
