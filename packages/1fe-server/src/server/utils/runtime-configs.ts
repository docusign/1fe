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
import { readOneFEConfigs } from './one-fe-configs';

const ALLOWED_TOKENS = ['WIDGET_VERSION', 'WIDGET_ID', 'ENVIRONMENT'] as const;

export const DISALLOWED_TEMPLATE_SYNTAX_ERROR =
  'Disallowed template syntax in apiGet URL';

const safeTemplateReplace = (
  input: string,
  values: Record<string, string | undefined>,
): string => {
  // Reject any <% %> or <%- %> (execute/escape blocks) - only <%= %> allowed
  if (/<%[^=]/.test(input) || /<%$/m.test(input)) {
    throw new Error(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
  }

  const result = input.replace(/<%=\s*(\w+)\s*%>/g, (match, token) => {
    if (ALLOWED_TOKENS.includes(token as (typeof ALLOWED_TOKENS)[number])) {
      return values[token] ?? '';
    }
    throw new Error(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
  });

  // Reject any remaining <%= ... %> blocks that weren't matched by the simple \w+ pattern
  if (/<%=/.test(result)) {
    throw new Error(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
  }

  return result;
};

type ParseRuntimeConfigArgs = {
  runtimeConfig: RuntimeConfig;
  widgetConfig: WidgetConfig;
};

type FetchSingleWidgetRuntimeConfigArgs = {
  widgetConfig: WidgetConfig;
};

export const generateRuntimeConfigCDNUrl = (widget: WidgetConfig): URL => {
  return templatizeCDNUrl({
    widgetId: widget.widgetId,
    widgetVersion: widget.version,
    templateFilePath: widgetRuntimeConfigUrlFilename,
  });
};

// If some runtime configurations are defined, then that means it is not a cold start
export const getIsColdStart = (): boolean => {
  return !Array.from(getCachedWidgetConfigs().values()).some(
    (widgetConfig) => widgetConfig.runtime !== undefined,
  );
};

export const parseRuntimeConfig = ({
  runtimeConfig,
  widgetConfig,
}: ParseRuntimeConfigArgs): RuntimeConfig => {
  const parsedRuntimeConfig = { ...runtimeConfig };

  if (parsedRuntimeConfig?.preload) {
    const parsedPreloads = parsedRuntimeConfig.preload.map(
      (preloadObj: PreloadType) => {
        if ('apiGet' in preloadObj) {
          const apiGetStr = preloadObj.apiGet as string;

          return {
            apiGet: safeTemplateReplace(apiGetStr, {
              WIDGET_VERSION: widgetConfig.version,
              WIDGET_ID: widgetConfig.widgetId,
              ENVIRONMENT: readOneFEConfigs()?.environment,
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

export const _fetchSingleWidgetRuntimeConfig = async ({
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
