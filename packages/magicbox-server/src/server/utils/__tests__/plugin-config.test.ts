import * as widgetConfig from '../widget-config';
import { generateWidgetConfigMap, getPluginConfigs } from '../widget-config-helpers';

const mockWidgetConfigs = generateWidgetConfigMap([
  {
    widgetId: '@1ds/widget-starter-kit',
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/starter-kit',
    },
    runtime: {},
  },
  {
    widgetId: '@internal/plugin-with-auth-example',
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/test',
    },
    runtime: {},
  },
  {
    widgetId: '@internal/1ds-plugin-with-auth-example-2',
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/test',
    },
    runtime: {},
  },
  {
    widgetId: 'test/pluginId',
    activePhasedDeployment: false,
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/test',
    },
    runtime: {},
  },
  {
    widgetId: 'test/widgetId',
    activePhasedDeployment: false,
    version: '0.0.0',
    runtime: {},
  },
]);

jest
  .spyOn(widgetConfig, 'getCachedWidgetConfigs')
  .mockReturnValue(mockWidgetConfigs);

describe('Get Plugin Config Tests', () => {
  // it.each([
  //   ['@1ds/widget-starter-kit', true],
  //   ['@internal/plugin-with-auth-example', true],
  //   ['@internal/1ds-plugin-with-auth-example-2', true],
  //   ['test/pluginId', true],
  //   ['test/widgetId', false],
  // ])(
  //   'shouldLoadInternalWidget is true, return plugin [%p] should be [%p]',
  //   (widgetId, expected) => {
  //     const result = getPluginConfigs();
  //     expect(
  //       result.find((widget) => widget.widgetId === widgetId) !== undefined,
  //     ).toBe(expected);

  //     expect(result.length).toBe(4);
  //   },
  // );

  it.each([
    ['@1ds/widget-starter-kit', true],
    ['@internal/plugin-with-auth-example', true],
    ['@internal/1ds-plugin-with-auth-example-2', true],
    ['test/pluginId', true],
    ['test/widgetId', false],
  ])(
    'shouldLoadInternalWidget is false, return plugin [%p] should be [%p]',
    (widgetId, expected) => {
      const result = getPluginConfigs();
      expect(
        result.find((widget) => widget.widgetId === widgetId) !== undefined,
      ).toBe(expected);

      expect(result.length).toBe(4);
    },
  );
});
