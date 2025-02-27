import { PluginConfig } from "../../types";
import { getPlugin, getPluginById } from "../plugin-helpers";
import { getCachedWidgetConfigs } from "../widget-config";
import { generateWidgetConfigMap } from "../widget-config-helpers";

const pluginConfig = {
  widgetId: '@ds/test',
  activePhasedDeployment: false,
  version: '5.5.5',
  plugin: {
    enabled: true,
    route: '/test',
  },
  runtime: {},
};

const mockWidgetConfigs = generateWidgetConfigMap([pluginConfig]);

const expectedResult: PluginConfig = {
  enabled: true,
  route: pluginConfig.plugin.route,
  widgetId: pluginConfig.widgetId,
};

jest.mock('../widget-config', () => ({
  getCachedWidgetConfigs: jest.fn(),
}));

beforeEach(() => {
  jest.mocked(getCachedWidgetConfigs).mockReturnValue(mockWidgetConfigs);
});

describe('getPlugin', () => {
  const validTestCases: string[][] = [
    ['test', expectedResult.widgetId],
    ['/test', expectedResult.widgetId],
    ['/test/', expectedResult.widgetId],
    ['/test#', expectedResult.widgetId],
    ['/test?', expectedResult.widgetId],
    ['/test?foo=bar', expectedResult.widgetId],
    ['/test#foo', expectedResult.widgetId],
    ['/test/foo', expectedResult.widgetId],
    ['/test/foo/bar', expectedResult.widgetId],
    ['/test/foo#bar', expectedResult.widgetId],
    ['/test/foo?bar=baz', expectedResult.widgetId],
    ['/test/test', expectedResult.widgetId],
  ];

  test.each(validTestCases)(
    'should return correct matching widget ID for route %s',
    async (path, expectedWidgetId) => {
      const result = await getPlugin(path);

      expect(result?.widgetId).toBe(expectedWidgetId);
    },
  );

  const invalidTestCases: [string, undefined][] = [
    ['/test1', undefined],
    ['/test-', undefined],
    ['/tester', undefined],
    ['/tester/', undefined],
    ['/tester?foo=bar', undefined],
    ['/tester#foo', undefined],
    ['/tester/foo', undefined],
    ['/tester/foo/bar', undefined],
    ['/tester/foo#bar', undefined],
    ['/tester/foo?bar=baz', undefined],
    ['/tester/test', undefined],
    ['/nonexistentwidget', undefined],
    ['foo', undefined],
    ['', undefined],
    [undefined as unknown as string, undefined],
    [null as unknown as string, undefined],
  ];

  test.each(invalidTestCases)(
    'should return undefined for non matched route %s',
    async (path, expectedWidgetId) => {
      const result = await getPlugin(path);

      expect(result?.widgetId).toBe(expectedWidgetId);
    },
  );
});

describe('getPluginById', () => {
  it('should return plugin if it exists', async () => {
    const result = await getPluginById(pluginConfig.widgetId);

    expect(result?.widgetId).toBe(expectedResult.widgetId);
  });

  it('should return undefined if plugin does not exist', async () => {
    const widgetId = 'test/nonexistentid';
    const result = await getPluginById(widgetId);

    expect(result).toBe(undefined);
  });
});
