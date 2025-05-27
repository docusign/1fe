import { ProcessedOneFEDDynamicConfigs } from '../../../../1fe-server/src/server/types/processed-dynamic-configs';
import {
  EnvConfig,
  PluginConfig,
  WidgetConfig,
  WidgetConfigs,
} from '../types/widget-config';

const generateWidgetConfigMap = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  parsedWidgetConfigData: T[],
): WidgetConfigs<T> =>
  new Map(
    parsedWidgetConfigData.map((widgetConfig) => [
      widgetConfig.widgetId,
      widgetConfig,
    ]),
  );

const getConfigArrFromGlobal = <Return>(
  configName: 'plugin-config' | 'widget-config' | 'dynamic-config',
): any => {
  const defaultValue = configName === 'dynamic-config' ? {} : [];

  try {
    const oneDsConfig: Return[] =
      JSON.parse(
        document?.querySelector(`script[data-1fe-config-id="${configName}"]`)
          ?.innerHTML || JSON.stringify(defaultValue),
      ) ?? defaultValue;

    return oneDsConfig;
  } catch (e) {
    return defaultValue;
  }
};

const getConfigObjFromGlobal = <Return extends object>(
  configName: 'lazy-loaded-libs-config' | '' | 'env-config',
  overrideSelector = `script[data-1fe-config-id="${configName}"]`,
): Return => {
  try {
    const oneDsConfig: Return =
      JSON.parse(
        document?.querySelector(overrideSelector)?.innerHTML ?? '{}',
      ) ?? {};

    if (Object.keys(oneDsConfig).length === 0) {
      return {} as Return;
    }

    return oneDsConfig;
  } catch (e) {
    return {} as Return;
  }
};

/**
 * List of all plugin configs that we have loaded from the global config, keyed by widgetId
 */
export const PLUGIN_CONFIGS: ReadonlyMap<string, PluginConfig> =
  generateWidgetConfigMap(
    getConfigArrFromGlobal<PluginConfig>('plugin-config'),
  );

/**
 * Map of all widget configs that we have loaded from the global config, keyed by widgetId
 */
export const WIDGET_CONFIGS = generateWidgetConfigMap(
  getConfigArrFromGlobal<WidgetConfig>('widget-config'),
);

export const ENVIRONMENT_CONFIG =
  getConfigObjFromGlobal<EnvConfig>('env-config');

/**
 * Map of all widget configs that we have loaded from the global config, keyed by widgetId
 */
export const DYNAMIC_CONFIGS =
  getConfigArrFromGlobal<Partial<ProcessedOneFEDDynamicConfigs>>('dynamic-config');

export const LAZY_LOADED_LIB_CONFIGS = getConfigObjFromGlobal<
  Record<string, string>
>('lazy-loaded-libs-config');

// TODO[1fe]: Duplicated code
export const getWidgetConfigValues = <
  T extends PluginConfig | WidgetConfig = WidgetConfig,
>(
  widgetConfigs: WidgetConfigs<T>,
): T[] => Array.from(widgetConfigs.values());

/**
 * Get the plugin baseline url from runtime config if it exists, otherwise fallback to 1fe-config
 * @param plugin
 * @returns baseline url
 */
export const getPluginBaselineUrl = (
  plugin: PluginConfig,
): string | undefined => {
  return (
    WIDGET_CONFIGS.get(plugin.widgetId)?.runtime?.plugin?.baselineUrl ||
    plugin?.baselineUrl
  );
};
