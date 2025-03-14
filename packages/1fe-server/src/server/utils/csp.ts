import { Request } from 'express';
import { RUNTIME_CONFIG_OVERRIDES } from '../constants';
import { RuntimeConfig } from '../types';
import { getParamFromQueryOrRedirectUri } from './url';
import { getCachedWidgetConfigs } from './widget-config';
import { readOneFEConfigs } from './one-fe-configs';

/**
 * Get runtime csp configurations. (defined in .1fe.config.ts)
 *
 * @param pluginId plugin's widgetId
 * @param reportOnly is the csp report-only or enforced
 * @param req request object to pull runtime_config_overrides query string
 * @returns Plugin's runtime csp configurations
 */
export const getRuntimeCSPConfigs = ({
  pluginId,
  reportOnly,
  req,
}: {
  pluginId: string;
  reportOnly: boolean;
  req: Request;
}) => {
  // Only want to override in local or integration. Not in higher environments.
  if (readOneFEConfigs().mode !== 'production') {
    // get stringified runtime configs
    const runtimeConfigOverridesParam = getParamFromQueryOrRedirectUri(
      req,
      RUNTIME_CONFIG_OVERRIDES,
    );

    // parse runtime config override if exist
    if (runtimeConfigOverridesParam) {
      const parsedRuntimeConfigs = JSON.parse(
        runtimeConfigOverridesParam,
      ) as Record<string, RuntimeConfig>;
      return reportOnly
        ? parsedRuntimeConfigs[pluginId]?.headers?.csp?.reportOnly
        : parsedRuntimeConfigs[pluginId]?.headers?.csp?.enforced;
    }
  }
  const pluginConfig = getCachedWidgetConfigs().get(pluginId);
  return reportOnly
    ? pluginConfig?.runtime?.headers?.csp?.reportOnly
    : pluginConfig?.runtime?.headers?.csp?.enforced;
};
