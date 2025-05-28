import { WidgetConfigs } from '../../types';
import { getPluginPreloadApiUrls, getPluginPreloadAssetUrls } from '../preload';
import { generateWidgetConfigMap } from '../widget-config-helpers';

const pluginWithPreloads = {
  activePhasedDeployment: true,
  version: '1.2.3',
  widgetId: 'plugin1',
  runtime: {
    preload: [
      {
        widget: 'widget',
        apiGet: 'apiGetUrl',
      },
    ],
  },
  plugin: {
    enabled: true,
    route: '/test',
  },
};

const pluginWithNoPreloads = {
  activePhasedDeployment: true,
  version: '1.2.3',
  widgetId: 'plugin-with-no-preloads',
  runtime: {},
};

const widget = {
  activePhasedDeployment: true,
  version: '1.2.3',
  widgetId: 'widget',
  runtime: {},
};

const widgetConfigs: WidgetConfigs = generateWidgetConfigMap([
  pluginWithPreloads,
  pluginWithNoPreloads,
  widget,
]);

const pluginId = 'test/widgetId';

jest.mock('ky', () => ({
  get: jest.fn().mockReturnValue({}),
}));

jest.mock('../one-fe-configs', () => ({
  readOneFEConfigs: jest.fn().mockImplementation(() => ({
    dynamicConfigs: {
      widgets: {
        basePrefix: 'https://example.com/cdn/widgets/',
      },
      libraries: {
        basePrefix: 'https://example.com/cdn/libraries/',
      },
    },
  })),
}));

describe('getPluginPreloadAssetUrls', () => {
  it('should return empty array if the pluginId is undefined', () => {
    const result = getPluginPreloadAssetUrls({
      widgetConfigs,
      pluginId: undefined,
    });

    expect(result.length).toBe(0);
  });

  it('should return empty array if the pluginConfig is undefined', () => {
    const result = getPluginPreloadAssetUrls({
      widgetConfigs,
      pluginId: '@doesnt/exist',
    });

    expect(result.length).toBe(0);
  });

  it('should return only the plugin bundle url if the plugin has no preloaded assets', () => {
    const result = getPluginPreloadAssetUrls({
      widgetConfigs,
      pluginId: pluginWithNoPreloads.widgetId,
    });

    expect(result.length).toBe(1);
    expect(result[0]).toBe(
      'https://example.com/cdn/widgets/plugin-with-no-preloads/1.2.3/js/1fe-bundle.js',
    );
  });

  it('should return preload urls array for plugin', () => {
    const pluginToTest = widgetConfigs.get(pluginWithPreloads.widgetId);
    // const expectedPluginUrl = pluginToTest?._url;

    // const expectedPreloadWidgetUrl = widgetConfigs.get(widget.widgetId)?._url;

    const result = getPluginPreloadAssetUrls({
      widgetConfigs,
      pluginId: pluginWithPreloads.widgetId,
    });

    expect(result.length).toBe(2);
    expect(result[0]).toBe(
      'https://example.com/cdn/widgets/plugin1/1.2.3/js/1fe-bundle.js',
    );
    expect(result[1]).toBe(
      'https://example.com/cdn/widgets/widget/1.2.3/js/1fe-bundle.js',
    );
  });
});

describe('getPluginPreloadApiUrls', () => {
  it('should empty array if no plugin provided', () => {
    const result = getPluginPreloadApiUrls({
      widgetConfigs,
      pluginId: undefined,
    });

    expect(result.length).toBe(0);
  });

  it('should empty array if no associated widget found for plugin', () => {
    const result = getPluginPreloadApiUrls({ widgetConfigs, pluginId });

    expect(result.length).toBe(0);
  });

  it('should return apiGet URLs from plugin', () => {
    const result = getPluginPreloadApiUrls({
      widgetConfigs,
      pluginId: pluginWithPreloads.widgetId,
    });

    expect(result.length).toBe(1);
    expect(result[0]).toBe('apiGetUrl');
  });
});
