import { NextFunction, Response, Request } from 'express';
import ejs from 'ejs';

import { getTemplate } from '../templates';
import { WidgetConfigs, SystemWidgetConfig, PluginConfig } from '../types';
import { getWidgetConfigValues } from '../utils';
import { dataForRenderingTemplate } from './data';
import { getCachedWidgetConfigs } from '../utils/widget-config';
import { readMagicBoxConfigs } from '../utils/magicbox-configs';

/*
TODO:
- [1DS consumption] Set feature flag hash elsewhere
- [1DS consumption] Set ACTIVE_AUTOMATED_TEST_FRAMEWORK cookie elsewhere
- Strongly type request
*/

export const getSystemWidgetConfigs = (
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
  if (readMagicBoxConfigs().mode === 'production') {
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
    readMagicBoxConfigs().mode === 'production' &&
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

      const dataForRenderingTemplatePayload =
        await dataForRenderingTemplate(req);

      const template = getTemplate('index.html.ejs');
      const html = ejs.render(template, dataForRenderingTemplatePayload);
      res.send(html);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
