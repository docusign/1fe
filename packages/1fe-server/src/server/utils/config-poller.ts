import { cloneDeep, isEmpty } from 'lodash';
import ky from 'ky';

import {
  ExternalLibConfig,
  InstalledLibConfig,
  WidgetConfig,
  WidgetConfigs,
} from '../types';
import { WIDGET_ID_UNAVAILABLE } from '../constants';
import {
  generateWidgetConfigMap,
  getWidgetConfigValues,
  mapAndGenerateWidgetConfigMap,
} from './widget-config-helpers';
import {
  fetchAllWidgetRuntimeConfigs,
  getFallbackRuntimeConfigs,
} from './runtime-configs';
import { getLibraryConfigs, setLibraryConfigs } from './libs';
import { templatizeCDNUrl } from '../controllers/version.controller';
import {
  getCachedWidgetConfigs,
  setCachedWidgetConfigs,
} from './widget-config';
import { setOneFEConfigs } from './one-fe-configs';

/*
TODO[1fe]:
- strongly type dynamicConfig
- strongly type configs
*/

interface WidgetBundleRequestResponse {
  widgetId: string;
  response?: Response;
  error?: unknown;
}

const performWidgetBundleRequest = async (
  widgetId: string,
  url: string,
): Promise<WidgetBundleRequestResponse> => {
  try {
    const response = await ky.get(url, {
      retry: 3,
      timeout: 10 * 1000,
    });

    return { widgetId, response };
  } catch (error) {
    return { widgetId, error };
  }
};

const fetchConfig = async (options: any) => {
  try {
    const getDynamicConfigs = async () => {
      if (options.configManagement.getDynamicConfigs) {
        return await options.configManagement.getDynamicConfigs();
      } else {
        const url = options.configManagement.url;
        const response = await ky.get(url, {
          retry: 5,
          timeout: 30 * 1000,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      }
    };

    const configJson = await getDynamicConfigs();

    const oneFEConfigs = {
      ...options,
      dynamicConfigs: configJson,
    };
    setOneFEConfigs(oneFEConfigs);

    return oneFEConfigs;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
};

const didWidgetVersionsUpdate = (
  previousConfigs: WidgetConfigs,
  phasedWidgetConfigs: WidgetConfigs,
): boolean => {
  // Loop through all new widget configs to see if version changed
  return getWidgetConfigValues(phasedWidgetConfigs).some(
    (newConfig: WidgetConfig) => {
      // Get widget version of old config
      const oldConfigVersion = previousConfigs.get(newConfig.widgetId)?.version;

      // 1.) If widget does not exist in old config, then assume widget is deleted or cold boot and we should update; return true
      // 2.) Return true if the versions do not match
      return (
        oldConfigVersion === undefined || oldConfigVersion !== newConfig.version
      );
    },
  );
};

const verifyWidgetCDNUrls = async (widgetConfigsToVerify: WidgetConfigs) => {
  const promiseArray = getWidgetConfigValues(widgetConfigsToVerify).reduce(
    (acc, widgetConfig) => {
      const { widgetId, version } = widgetConfig;
      const widgetUrl = templatizeCDNUrl({
        widgetId,
        widgetVersion: version,
      });

      // Construct array of fetch requests to cdn urls
      return [
        ...acc,
        performWidgetBundleRequest(widgetId, widgetUrl.toString()),
      ];
    },
    [] as Promise<WidgetBundleRequestResponse>[],
  );

  // Wait for promises to settle
  const results = await Promise.allSettled(promiseArray);

  // Check if all promises result in 200
  return results
    .filter((result) => {
      return !(
        result.status === 'fulfilled' && result?.value?.response?.status === 200
      );
    })
    .map((result) => {
      return result.status === 'fulfilled'
        ? result.value.widgetId
        : WIDGET_ID_UNAVAILABLE;
    });
};

export const processDynamicLibraryConfig = (config: any): void => {
  try {
    const libraryConfigsPayload: (ExternalLibConfig | InstalledLibConfig)[] =
      config?.cdn?.libraries?.managed || [];

    //   const previousConfigs = getLibraryConfigs();

    // Check if new config is different than current config, if so, log
    //   if (!_isEqual(previousConfigs, libraryConfigsPayload)) {
    //   }

    if (!isEmpty(libraryConfigsPayload)) {
      setLibraryConfigs(cloneDeep(libraryConfigsPayload));
    } else {
      if (isEmpty(getLibraryConfigs())) {
        throw new Error(
          '[DYNAMIC_CONFIG][LIBRARY][CRITICAL] Library config empty and initial libraryConfig is empty as well!',
        );
      }

      return;
    }
  } catch (error) {
    // re-throw error, (doing this to keep error handling parity now that a new try/catch block is added with the span)
    throw error;
  }
};

const processDynamicWidgetConfig = async (config: any): Promise<void> => {
  try {
    const widgetConfigsPayload = config?.cdn?.widgets?.releaseConfig || [];
    const cachedWidgetConfigsEmptyMessage =
      '[DYNAMIC_CONFIG][WIDGETS][CRITICAL] Widget config empty and initial widgetConfig is empty as well!';

    if (isEmpty(widgetConfigsPayload)) {
      if (isEmpty(getCachedWidgetConfigs())) {
        throw new Error(cachedWidgetConfigsEmptyMessage);
      }
      return;
    }

    const previousConfigs = getCachedWidgetConfigs();

    let widgetConfigMap = generateWidgetConfigMap(widgetConfigsPayload);

    // Check if new config is different than current config, if so, log
    if (didWidgetVersionsUpdate(previousConfigs, widgetConfigMap)) {
      const newWidgetConfigs =
        await fetchAllWidgetRuntimeConfigs(widgetConfigMap);

      // Construct widget cdn urls and ensure they return 200
      const widgetCdnUrlsNotVerified =
        await verifyWidgetCDNUrls(newWidgetConfigs);

      // Consume if widget urls are verified
      if (widgetCdnUrlsNotVerified.length === 0) {
        setCachedWidgetConfigs(newWidgetConfigs);
      } else {
        // Log critical error if failed to verify widget bundles from cdn
        if (isEmpty(getCachedWidgetConfigs())) {
          throw new Error(cachedWidgetConfigsEmptyMessage);
        }
      }
    } else {
      // If widget version did not change, update cached widget configs with old runtime configs
      setCachedWidgetConfigs(
        mapAndGenerateWidgetConfigMap(
          widgetConfigMap,
          getFallbackRuntimeConfigs,
        ),
      );
    }
  } catch (error) {
    // re-throw error, (doing this to keep error handling parity now that a new try/catch block is added with the span)
    throw error;
  }
};

export const pollDynamicConfig = async (options: any) => {
  const intervalMs = options.configManagement.refreshMs;

  // Convert seconds to milliseconds for setInterval
  const intervalInMilliseconds = intervalMs;

  const initialConfig = await fetchConfig(options);

  if (initialConfig) {
    processDynamicWidgetConfig(initialConfig.dynamicConfigs);
    processDynamicLibraryConfig(initialConfig.dynamicConfigs);
  } else {
    throw new Error('Failed to fetch initial config. Exiting...');
  }

  // Start the polling loop
  setInterval(async () => {
    const initialConfig = await fetchConfig(options);

    if (initialConfig) {
      processDynamicWidgetConfig(initialConfig.dynamicConfigs);
      processDynamicLibraryConfig(initialConfig.dynamicConfigs);
    }
  }, intervalInMilliseconds);
};
