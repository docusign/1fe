import { Request } from 'express';

import { isEmpty, omit } from 'lodash';
import { RuntimeConfig, WidgetConfig, WidgetConfigs } from '../../types';
import { mapAndGenerateWidgetConfigMap } from '../../utils';
import { parseRuntimeConfig } from '../../utils/runtime-configs';
import { getCachedWidgetConfigs } from '../../utils/widget-config';
import { getParamFromQueryOrRedirectUri } from '../../utils/url';
import { RUNTIME_CONFIG_OVERRIDES, WIDGET_URL_OVERRIDES } from '../../constants';
import { readMagicBoxConfigs } from '../../utils/magicbox-configs';
import { fetchRuntimeConfigsForWidgetUrlOverrides } from '../../utils/request-helpers';

/**
 *
 * @param widgetConfigs
 * @returns boolean
 *
 * If the runtime_config_overrides query param is present in lower envs, override the runtime config based on widgetId.
 */
export const _overrideRuntimeConfigs = (
    runtimeConfigOverrides: Record<string, RuntimeConfig>,
    widgetConfigs: WidgetConfigs,
  ): WidgetConfigs => {
    const overridenWidgetConfigs = mapAndGenerateWidgetConfigMap(
      widgetConfigs,
      (widgetConfig) => {
        const runtimeConfigOverride =
          runtimeConfigOverrides[widgetConfig.widgetId];
  
        if (runtimeConfigOverride) {
          return {
            ...widgetConfig,
            runtime: parseRuntimeConfig({
              runtimeConfig: runtimeConfigOverride,
              widgetConfig,
            }),
          };
        }
  
        return widgetConfig;
      },
    );
  
    return overridenWidgetConfigs;
  };

/**
 *
 * @param req
 * @returns Request
 *
 * If the runtime_config_overrides query param is present in lower envs,
 * override the runtime config based on widgetId.
 *
 * If the widget_url_overrides query param is present in any env, fetch the
 * versioned runtime config for the widget and apply the override.
 */
export const getWidgetConfigsForIndexHtml = async (
    req: Request,
  ): Promise<WidgetConfigs> => {
    const cachedWidgetConfig = getCachedWidgetConfigs();
  
    try {
      const widgetUrlOverrides = getParamFromQueryOrRedirectUri(
        req,
        WIDGET_URL_OVERRIDES,
      ); 
      const runtimeConfigOverridesParam = getParamFromQueryOrRedirectUri(
        req,
        RUNTIME_CONFIG_OVERRIDES,
      );
  
      const parsedWidgetUrlOverrides = JSON.parse(
        widgetUrlOverrides || '{}',
      ) as Record<string, string>;
  
      const parsedRuntimeConfigOverrides = JSON.parse(
        runtimeConfigOverridesParam || '{}',
      ) as Record<string, RuntimeConfig>;
  
      const widgetUrlOverrideRuntimeConfigOverrides = !isEmpty(
        parsedWidgetUrlOverrides,
      )
        ? await fetchRuntimeConfigsForWidgetUrlOverrides(parsedWidgetUrlOverrides)
        : {};
  
      // We do not support the runtime_config_overrides query param higher envs for security reasons
      const runtimeConfigOverridesToApply = readMagicBoxConfigs().mode !== 'production'
        ? {
            ...widgetUrlOverrideRuntimeConfigOverrides,
            // parsedRuntimeConfigOverrides intentionally comes second.
            // explicit overrides from req.query[RUNTIME_CONFIG_OVERRIDES] should override implciit overrides from req.query[WIDGET_URL_OVERRIDES].
            ...parsedRuntimeConfigOverrides,
          }
        : widgetUrlOverrideRuntimeConfigOverrides;
  
      if (!isEmpty(runtimeConfigOverridesToApply)) {
        return _overrideRuntimeConfigs(
          runtimeConfigOverridesToApply,
          cachedWidgetConfig,
        );
      }
    } catch (e: any) {
      console.error(
        '[CRITICAL][1DS][RUNTIME CONFIG OVERRIDES] Unable to parse JSON in runtime_config_overrides query param',
        e.stack,
      );
    }
  
    return cachedWidgetConfig;
  };

export const validateWidgetConfig = (widgetConfig: WidgetConfig): boolean => {
  switch (true as boolean) {
    case typeof widgetConfig !== 'object':
    case isEmpty(widgetConfig):
    case typeof widgetConfig.runtime !== 'object':
      return false;
  }

  return true;
};