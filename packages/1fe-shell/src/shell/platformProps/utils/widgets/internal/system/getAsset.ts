import 'react';
import { isSystemEnv } from '../utils/isSystem';
import { getShellLogger } from '../../../../../utils/telemetry';

import { logPlatformUtilUsage } from '../../../logPlatformUtilUsage';

export const getAsset =
  (_System: typeof System, hostWidgetId: string) =>
  async (widgetId: string, path: string): Promise<any> => {
    const logger = getShellLogger();

    logPlatformUtilUsage({
      utilNamespace: 'widgets',
      functionName: 'getAsset',
      widgetId: hostWidgetId,
      args: { widgetId, path },
      attributes: { isSystemEnv },
    });

    if (widgetId && isSystemEnv()) {
      try {
        const oneDsBundleUrl = await (window.importMapOverrides
          ? window.importMapOverrides
              .getCurrentPageMap()
              .then(
                (importMap: { imports: Record<string, string> }) =>
                  importMap.imports[widgetId],
              )
          : _System.resolve(widgetId));

        const cdnBaseUrl = oneDsBundleUrl.replace(/js\/1fe-bundle\.js$/, '');

        return await _System.import(`${cdnBaseUrl}${path}`);
      } catch (error) {
        const message = `[UTILS_API][WIDGETS] Getting widget asset by ID failed.`;

        console.error(message, error, widgetId, path);
        logger.error({
          error,
          message,
          path,
          category: 'utils.widgets.getAsset',
          widgetId,
        });

        throw new Error(message);
      }
    }

    console.warn(
      '[UTILS_API] (widgets.get) Incorrect usage of API, please refer to API documentation.',
    );
    throw new Error('Improper usage of widgets.getAsset() or bad environment.');
  };
