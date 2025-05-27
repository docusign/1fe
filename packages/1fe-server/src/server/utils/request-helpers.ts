import { Request } from 'express';
import ky from 'ky';

import { getCachedWidgetConfigs } from './widget-config';
import { RuntimeConfig } from '../types';
import { widgetRuntimeConfigUrlFilename } from '../constants';

export const getRequestHost = (req: Request) => {
  const isLocalhost =
    req.hostname === 'localhost' || req.hostname === '127.0.0.1';

  if (isLocalhost) {
    return `http://${req.hostname}:${req.socket.localPort}`;
  } else {
    return `https://${req.hostname}`;
  }
};

/**
 *
 * @param widgetUrlOverrides { widgetId: bundleUrl}
 *
 * @returns { widgetId: RuntimeConfig }
 */
export const fetchRuntimeConfigsForWidgetUrlOverrides = async (
  widgetUrlOverrides: Record<string, string>,
): Promise<Record<string, RuntimeConfig>> => {
  const runtimeConfigs: Record<string, RuntimeConfig> = {};
  const widgetConfigs = getCachedWidgetConfigs();

  const runtimeConfigFetches = Object.entries(widgetUrlOverrides)
    // widgetConfigs.get(widgetId) - exclude non-widget overrides, e.g. @ds/ui
    .filter(([widgetId, url]) => widgetConfigs.get(widgetId))
    .map(async ([widgetId, url]) => {
      // e.g.
      // https://docutest-a.akamaihd.net/integration/1fe/widgets/@internal/generic-child-widget/1.0.20/js/1fe-bundle.js
      // =>
      // https://docutest-a.akamaihd.net/integration/1fe/widgets/@internal/generic-child-widget/1.0.20/widget-runtime-config.json
      const runtimeConfigUrl = url.replace(
        'js/1fe-bundle.js',
        widgetRuntimeConfigUrlFilename,
      );

      const response = await ky.get(new URL(runtimeConfigUrl), {
        retry: 3,
        timeout: 10 * 1000,
      });

      const runtimeConfig = await response.json();

      runtimeConfigs[widgetId] = runtimeConfig || {};

      return runtimeConfig;
    });

  const rejectedResults = (
    await Promise.allSettled(runtimeConfigFetches)
  )?.filter(
    (promise) => promise.status === 'rejected',
  ) as PromiseRejectedResult[];

  if (rejectedResults.length > 0) {
    const message =
      '[1FE][WIDGET_URL_OVERRIDES][fetchRuntimeConfigsForWidgetUrlOverrides] Failed to fetch runtime configs for widgets';

    const errorData = rejectedResults.map((promise) => promise.reason);

    console.error(message, errorData);
  }

  return runtimeConfigs;
};
