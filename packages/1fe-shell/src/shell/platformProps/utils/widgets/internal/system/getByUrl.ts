import 'react';

import { logPlatformUtilUsage } from '../../../logPlatformUtilUsage';
import { getDefaultWidgetOptions } from '../utils/constants';
import { WidgetOptions } from '../../../../../types/platform-utils';
import { isSystemEnv } from '../utils/isSystem';
import { getComponentFromModule } from '../utils/getComponentFromModule';
import { getShellLogger } from '../../../../../utils/telemetry';

export const getByUrl =
  (_System: typeof System, hostWidgetId: string) =>
  async (
    url: URL,
    {
      variantId = getDefaultWidgetOptions().variantId,
    }: Partial<WidgetOptions> = getDefaultWidgetOptions(), // NOTE: always deconstruct here to individually initialize options
  ): Promise<System.Module> => {
    const logger = getShellLogger();

    const options = { variantId };

    logPlatformUtilUsage({
      utilNamespace: 'widgets',
      functionName: 'getByUrl',
      widgetId: hostWidgetId,
      args: { url, options },
      attributes: { isSystemEnv },
    });

    if (url && isSystemEnv()) {
      const urlAsAString = url.toString();

      try {
        const module = await _System.import(urlAsAString);

        return getComponentFromModule({
          options,
          module,
          log(message: string) {
            logger.log({
              message,
              url: urlAsAString,
              category: 'utils.widgets.getByUrl',
              widgetId: hostWidgetId
            });
          },
        });
      } catch (error) {
        const message = '[UTILS_API][WIDGETS] Getting widget by URL failed.';

        console.error(message, error, urlAsAString, options);
        logger.error({
          error,
          message,
          url: urlAsAString,
          category: 'utils.widgets.getByUrl',
          widgetId: hostWidgetId
        });

        throw new Error(message);
      }
    }

    console.warn(
      '[UTILS_API] (widgets.getByUrl) Incorrect usage of API, please refer to API documentation.',
    );
    throw new Error('Improper usage of widgets.getByUrl() or bad environment.');
  };
