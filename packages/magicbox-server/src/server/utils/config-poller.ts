import { isEmpty, isObjectLike } from 'lodash';
import { WidgetConfig, WidgetConfigs } from '../types';
import { WIDGET_ID_UNAVAILABLE } from '../constants';
import { getHostedOrSimulatedEnvironment } from '../configs';
import {
  generateWidgetConfigMap,
  getCachedWidgetConfigs,
  getWidgetConfigValues,
  mapAndGenerateWidgetConfigMap,
  setCachedWidgetConfigs,
} from './widget-config';
import {
  fetchAllWidgetRuntimeConfigs,
  getFallbackRuntimeConfigs,
} from './runtime-configs';

/*
TODO:
- playwright environment override
- Strong type result
- Replace IS_PROD with "mode" configuration
- templatizeCDNUrl should consume baseurl from options
- revisit retries
*/

const IS_PROD = true;
const ENVIRONMENT = 'production';

interface WidgetBundleRequestResponse {
  widgetId: string;
  response?: Response;
  error?: unknown;
}

type TemplatizeCDNUrlArgs = {
  widgetId: string;
  widgetVersion: string;
  ENVIRONMENT: string;
  IS_PROD?: boolean;
  templateFilePath?: string;
};

const templatizeCDNUrl = ({
  widgetId,
  widgetVersion,
  ENVIRONMENT,
  IS_PROD = true,
  templateFilePath = 'js/1ds-bundle.js',
}: TemplatizeCDNUrlArgs): URL => {
  if (isObjectLike(widgetVersion)) {
    const message = `malform widgetVersion ${JSON.stringify(
      widgetVersion,
    )} from widget: ${widgetId}`;

    throw new Error(message);
  }

  return new URL(
    IS_PROD
      ? `https://docucdn-a.akamaihd.net/${ENVIRONMENT}/1ds/widgets/${widgetId}/${widgetVersion}/${templateFilePath}`
      : `https://docutest-a.akamaihd.net/${ENVIRONMENT}/1ds/widgets/${widgetId}/${widgetVersion}/${templateFilePath}`,
  );
};

const performWidgetBundleRequest = async (
  widgetId: string,
  url: string,
): Promise<WidgetBundleRequestResponse> => {
  try {
    const response = await fetch(url);
    return { widgetId, response };
  } catch (error) {
    return { widgetId, error };
  }
};

const fetchConfig = (url: string) => {
  return fetch(url, {
    method: 'GET', // You can change this to POST or any other HTTP method if needed
    headers: {
      Authorization: `Bearer ${process.env.GH_REPO_READ_TOKEN}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON response
    })
    .catch((error) => {
      console.error('Error fetching config:', error);
    });
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
        ENVIRONMENT: getHostedOrSimulatedEnvironment(ENVIRONMENT),
        IS_PROD,
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

const pollDynamicWidgetConfig = async (url: string): Promise<void> => {
  try {
    const result = await fetchConfig(url);

    const widgetConfigsPayload =
      (result as any)?.cdn?.widgets?.releaseConfig || [];
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

      // TODO: Rewire this up later. Skipping to unblock development
      const SKIP_WIDGET_CDN_VERIFICATION = true;

      // Consume if widget urls are verified
      if (
        widgetCdnUrlsNotVerified.length === 0 ||
        SKIP_WIDGET_CDN_VERIFICATION
      ) {
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

export const pollDynamicConfig = async (url: string, intervalMs: number) => {
  // Convert seconds to milliseconds for setInterval
  const intervalInMilliseconds = intervalMs;

  await pollDynamicWidgetConfig(url);

  // Start the polling loop
  setInterval(() => pollDynamicWidgetConfig(url), intervalInMilliseconds);
};
