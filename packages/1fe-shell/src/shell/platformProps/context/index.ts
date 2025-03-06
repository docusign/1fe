import { PlatformContextType, WidgetOptions } from '../../types/platform-utils';
import { WidgetConfig } from '../../types/widget-config';
import { getDefaultWidgetOptions } from '../utils/widgets/internal/utils/constants';

import { getHostWidget } from './getHostWidget';
// import { getTree } from './getTree';
// import { getPlugin } from './getPlugin';

export const getContext = (
  widget: WidgetConfig,
  options: WidgetOptions = getDefaultWidgetOptions(),
): PlatformContextType => {
  return {
    self: {
      widgetId: widget.widgetId,
      version: widget.version,
      variantId: options.variantId,
    },
    getHost: () => getHostWidget(widget),
    // The following methods are intentionally disabled for now
    // context: https://docusign.slack.com/archives/C04CZ0F69CJ/p1709672412983809
    // getTree,
    // yggdrasil: getTree,
    // getPlugin,
  };
};
