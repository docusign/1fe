import { template } from 'lodash';
import ky from 'ky';

import { widgetRuntimeConfigUrlFilename } from '../constants';
import { templatizeCDNUrl } from '../controllers/version.controller';
import {
  PreloadType,
  RuntimeConfig,
  WidgetConfig,
  WidgetConfigs,
} from '../types';
import {
  generateWidgetConfigMap,
  getWidgetConfigValues,
} from './widget-config-helpers';
import { getCachedWidgetConfigs } from './widget-config';
import { readMagicBoxConfigs } from './magicbox-configs';

type ParseRuntimeConfigArgs = {
  runtimeConfig: RuntimeConfig;
  widgetConfig: WidgetConfig;
};

type FetchSingleWidgetRuntimeConfigArgs = {
  widgetConfig: WidgetConfig;
};

const generateRuntimeConfigCDNUrl = (widget: WidgetConfig): URL => {
  return templatizeCDNUrl({
    widgetId: widget.widgetId,
    widgetVersion: widget.version,
    templateFilePath: widgetRuntimeConfigUrlFilename,
  });
};

// If some runtime configurations are defined, then that means it is not a cold start
const getIsColdStart = (): boolean => {
  return !Array.from(getCachedWidgetConfigs().values()).some(
    (widgetConfig) => widgetConfig.runtime !== undefined,
  );
};

const parseRuntimeConfig = ({
  runtimeConfig,
  widgetConfig,
}: ParseRuntimeConfigArgs): RuntimeConfig => {
  const parsedRuntimeConfig = { ...runtimeConfig };

  if (parsedRuntimeConfig?.preload) {
    const parsedPreloads = parsedRuntimeConfig.preload.map(
      (preloadObj: PreloadType) => {
        if ('apiGet' in preloadObj) {
          const templatizedApiGetUrl = template(preloadObj.apiGet as string);

          return {
            apiGet: templatizedApiGetUrl({
              WIDGET_VERSION: widgetConfig.version,
              WIDGET_ID: widgetConfig.widgetId,

              // If 1ds-app is running locally, the environment is development.
              // There is no cdn for development, so we use integration instead.
              ENVIRONMENT: readMagicBoxConfigs().environment,
            }),
          };
        }

        return preloadObj;
      },
    );

    parsedRuntimeConfig.preload =
      parsedPreloads as typeof parsedRuntimeConfig.preload;
  }

  return parsedRuntimeConfig;
};

const _fetchSingleWidgetRuntimeConfig = async ({
  widgetConfig,
}: FetchSingleWidgetRuntimeConfigArgs): Promise<WidgetConfig> => {
  const widgetRuntimeConfigUrl = generateRuntimeConfigCDNUrl(widgetConfig);

  const response = await ky.get(widgetRuntimeConfigUrl, {
    retry: 3,
    timeout: 10 * 1000,
  });

  const isColdStart = getIsColdStart();

  if (response?.status === 200) {
    const runtimeConfig: RuntimeConfig = await response.json();

    return {
      ...widgetConfig,
      runtime: parseRuntimeConfig({
        runtimeConfig,
        widgetConfig,
      }),
    };
  } else if (response?.status >= 400 && response?.status < 500) {
    return getFallbackRuntimeConfigs(widgetConfig);
  } else if (response?.status >= 500 && !isColdStart) {
    const retryResponse = await ky.get(widgetRuntimeConfigUrl, {
      retry: 3,
      timeout: 10 * 1000,
    });

    if (retryResponse?.status === 200) {
      const retryRuntimeConfig: RuntimeConfig = await retryResponse.json();

      return {
        ...widgetConfig,
        runtime: parseRuntimeConfig({
          runtimeConfig: retryRuntimeConfig,
          widgetConfig,
        }),
      };
    }

    return getFallbackRuntimeConfigs(widgetConfig);
  } else if (response?.status >= 500) {
    const message =
      '[DYNAMIC_CONFIG][WIDGETS][CRITICAL] Failed to fetch runtime config for widget with 5xx during cold start. Retrying infinitely.';

    console.error(message, widgetConfig);

    // recursively retry on 5xx response during cold start
    const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
      widgetConfig,
    });

    return newWidgetConfig;
  }

  // this should never be hit, but including to be safe and make typescript happy
  return getFallbackRuntimeConfigs(widgetConfig);
};

export const getFallbackRuntimeConfigs = (
  widgetConfig: WidgetConfig,
): WidgetConfig => {
  try {
    const cachedWidgetConfig = getCachedWidgetConfigs().get(
      widgetConfig.widgetId,
    );

    return {
      ...widgetConfig,
      runtime: cachedWidgetConfig?.runtime || {},
    };
  } catch (e) {
    return {
      ...widgetConfig,
      runtime: {},
    };
  }
};

export const fetchAllWidgetRuntimeConfigs = async (
  widgetConfigs: WidgetConfigs,
): Promise<WidgetConfigs> => {
  const updatedWidgetConfigs = await Promise.all(
    getWidgetConfigValues(widgetConfigs).map(async (widgetConfig) => {
      try {
        // Will recursively retry on 5xx response
        const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
          widgetConfig,
        });

        return newWidgetConfig;
      } catch (error: unknown) {
        // If anything goes wrong while making request, should fallback
        return getFallbackRuntimeConfigs(widgetConfig);
      }
    }),
  );

  return generateWidgetConfigMap(updatedWidgetConfigs);
};
