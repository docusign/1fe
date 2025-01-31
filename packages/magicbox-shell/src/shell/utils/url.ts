import { DYNAMIC_CONFIGS } from "../configs/config-helpers";

const templatizeCDNUrl = ({
    widgetId,
    widgetVersion,
    templateFilePath = 'js/1ds-bundle.js',
  }: any): URL => {
    return new URL(
      `${DYNAMIC_CONFIGS.cdn.widgets.basePrefix}${widgetId}/${widgetVersion}/${templateFilePath}`,
    );
  };

export const generateCDNUrl = (widget: any): URL => {
    return templatizeCDNUrl({
      widgetId: widget.widgetId,
      widgetVersion: widget.version,
    });
  };
  