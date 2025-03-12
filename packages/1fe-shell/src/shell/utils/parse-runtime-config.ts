import { template } from 'lodash';
import { RuntimeConfig, WidgetConfig } from '../types/widget-config';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';

type ParseRuntimeConfigArgs = {
  runtimeConfig: RuntimeConfig;
  widgetConfig: WidgetConfig;
};

export const parseRuntimeConfig = ({
  runtimeConfig,
  widgetConfig,
}: ParseRuntimeConfigArgs): RuntimeConfig => {
  const parsedRuntimeConfig = { ...runtimeConfig };

  if (parsedRuntimeConfig?.preload) {
    const parsedPreloads = parsedRuntimeConfig.preload.map((preloadObj) => {
      if ('apiGet' in preloadObj) {
        const templatizedApiGetUrl = template(preloadObj.apiGet as string);

        return {
          apiGet: templatizedApiGetUrl({
            WIDGET_VERSION: widgetConfig.version,
            WIDGET_ID: widgetConfig.widgetId,

            // If 1ds-app is running locally, the environment is development.
            // There is no cdn for development, so we use integration instead.
            // TODO[post-mvp][1fe]: How do we consume this back in 1ds if development has it's own cdn?
            ENVIRONMENT: readMagicBoxShellConfigs().environment
          }),
        };
      }

      return preloadObj;
    });

    parsedRuntimeConfig.preload =
      parsedPreloads as typeof parsedRuntimeConfig.preload;
  }

  return parsedRuntimeConfig;
};
