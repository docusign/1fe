import { NextFunction, Response, Request } from 'express';
import ejs from 'ejs';

import { getTemplate } from '../templates';
import { WidgetConfigs, SystemWidgetConfig, PluginConfig } from '../types';
import { getWidgetConfigValues } from '../utils';
import { getCachedWidgetConfigs } from '../utils/widget-configs';
import { dataForRenderingTemplate } from './data';

/*
TODO:
- Set feature flag hash elsewhere
- Strongly type request
- Set ACTIVE_AUTOMATED_TEST_FRAMEWORK cookie elsewhere
- Implement getCachedWidgetConfigs
- Implement dataForRenderingTemplate
*/

// TODO - Make these configurable via options: IS_PROD
const IS_PROD = true;

const getSystemWidgetConfigs = (
  widgetConfigs: WidgetConfigs,
): SystemWidgetConfig[] => {
  const systemWidgetConfig = getWidgetConfigValues(widgetConfigs).filter(
    (widget) => widget.type === 'system',
  ) as SystemWidgetConfig[];

  return systemWidgetConfig;
};

/**
 * exported for unit testing
 */
export const allowUnsafeEvalForSystemPluginsOnPreprod = (
  plugin: PluginConfig,
): boolean => {
  if (IS_PROD) {
    return false;
  }

  const widgetConfigs = getCachedWidgetConfigs();

  return getSystemWidgetConfigs(widgetConfigs).some(
    (widget) => widget.widgetId === plugin?.widgetId,
  );
};

/**
 * exported for unit testing
 */
export const ifSystemPluginRequestedOnProd = (
  plugin: PluginConfig,
): boolean => {
  const widgetConfigs = getCachedWidgetConfigs();

  return (
    IS_PROD &&
    getSystemWidgetConfigs(widgetConfigs).some(
      (widget) => widget.widgetId === plugin?.widgetId,
    )
  );
};

class IndexController {
  public static index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
      try {

        const pluginFound = (req as any).plugin;

        if (pluginFound && ifSystemPluginRequestedOnProd(pluginFound)) {
          res.sendStatus(404);
        } else if (
          pluginFound &&
          allowUnsafeEvalForSystemPluginsOnPreprod(pluginFound)
        ) {
          res.set({
            'Content-Security-Policy':
              "connect-src * data: blob: 'unsafe-inline'",
          });
        }

        const dataForRenderingTemplatePayload = await dataForRenderingTemplate(
          req,
        );

        const template = getTemplate('index.html.ejs');
        const html = ejs.render(template, dataForRenderingTemplatePayload);
        res.send(html);
      } catch (error) {
        next(error);
      }
  };
}

export default IndexController;
