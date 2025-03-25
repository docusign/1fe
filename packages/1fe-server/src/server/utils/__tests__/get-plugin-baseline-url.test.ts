import { PluginConfig } from '../../types';
import { getPluginBaselineUrl, getPluginById } from '../plugin-helpers';
import { generateWidgetConfigMap } from '../widget-config-helpers';
import * as widgetConfig from '../widget-config';

const WIDGET_ID_WITH_RUNTIME_BASELINE_URL =
  'widget-id-with-runtime-baseline-url';

const WIDGET_ID_WITHOUT_RUNTIME_BASELINE_URL =
  'widget-id-without-runtime-baseline-url';

const RUNTIME_BASELINE_URL = 'https://example.com/runtime-baseline';
const PLUGIN_CONFIG_BASELINE_URL = 'https://example.com/baseline';

const mockWidgetConfigs = generateWidgetConfigMap([
  {
    widgetId: WIDGET_ID_WITH_RUNTIME_BASELINE_URL,
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/starter-kit',
    },
    runtime: {
      plugin: {
        baselineUrl: RUNTIME_BASELINE_URL,
      },
    },
  },
  {
    widgetId: WIDGET_ID_WITHOUT_RUNTIME_BASELINE_URL,
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/test',
    },
    runtime: {},
  },
]);

jest
  .spyOn(widgetConfig, 'getCachedWidgetConfigs')
  .mockReturnValue(mockWidgetConfigs);

describe('getPluginBaselineUrl', () => {
  const pluginConfigWithRuntimeBaselineUrl = {
    widgetId: WIDGET_ID_WITH_RUNTIME_BASELINE_URL,
  } as PluginConfig;

  const pluginConfigWithoutRuntimeBaselineUrl = {
    widgetId: WIDGET_ID_WITHOUT_RUNTIME_BASELINE_URL,
    baselineUrl: PLUGIN_CONFIG_BASELINE_URL,
  } as PluginConfig;

  const pluginConfigWithoutBaselineUrl = {
    widgetId: WIDGET_ID_WITHOUT_RUNTIME_BASELINE_URL,
  } as PluginConfig;

  it('returns runtime baseline url when found', () => {
    const result = getPluginBaselineUrl(pluginConfigWithRuntimeBaselineUrl);
    expect(result).toEqual(RUNTIME_BASELINE_URL);
  });

  it('returns plugin baseline url when runtime baseline url is not found', () => {
    const result = getPluginBaselineUrl(pluginConfigWithoutRuntimeBaselineUrl);
    expect(result).toEqual(PLUGIN_CONFIG_BASELINE_URL);
  });

  it('returns undefined when both runtime and plugin baseline urls are not found', () => {
    const result = getPluginBaselineUrl(pluginConfigWithoutBaselineUrl);
    expect(result).toBeUndefined();
  });
});
