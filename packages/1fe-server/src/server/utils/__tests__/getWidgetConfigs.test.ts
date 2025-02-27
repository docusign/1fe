import { PINNED_WIDGET_TYPE } from "../../constants";
import { getSystemWidgetConfigs } from "../../controllers/index.controller";
import { WidgetConfig } from "../../types";
import { generateWidgetConfigMap, getPinnedWidgets, getRequestedWidgetConfigWithoutRuntimeConfig, getWidgetConfigValues } from "../widget-config-helpers";

jest.mock('ky', () => ({
  get: jest.fn().mockReturnValue({}),
}));

const pinnedWidgetConfig = {
  widgetId: 'pinnedWidget',
  version: '1.1.0',
  type: PINNED_WIDGET_TYPE,
} as WidgetConfig;


const expectedPinnedVersion = '1.0.0'; // different from pinnedWidgetConfig

const nonExistentWidgetId = 'i-dont-exist';

const widgetConfig = {
  widgetId: 'testWidget',
  version: '1.0.0',
} as WidgetConfig;

const notPinnedWidget = {
  widgetId: 'notPinnedWidget',
  version: '1.0.0',
} as WidgetConfig;

const pluginConfig = {
  widgetId: 'testPlugin',
  runtime: {
    dependsOn: {
      pinnedWidgets: [
        {
          widgetId: pinnedWidgetConfig.widgetId,
          version: expectedPinnedVersion,
        },
        {
          widgetId: nonExistentWidgetId,
          version: '1.0.0',
        },
        {
          widgetId: notPinnedWidget.widgetId,
          version: '1.0.0',
        },
      ],
    },
  },
} as WidgetConfig;

const systemWidgetConfig = {
  type: 'system',
  version: '1.0.0',
  widgetId: 'testSystem',
} as WidgetConfig;

const widgetConfigArr = [
  pluginConfig,
  systemWidgetConfig,
  widgetConfig,
  pinnedWidgetConfig,
  notPinnedWidget,
];

const widgetConfigs = generateWidgetConfigMap<WidgetConfig>(widgetConfigArr);

describe('getWidgetConfigValues', () => {
  it('should return an array of widget config values', () => {
    const result = getWidgetConfigValues(widgetConfigs);

    expect(result).toEqual(widgetConfigArr);
  });
});

describe('getSystemWidgetConfigs', () => {
  it('should return an array of system widget config', () => {
    const result = getSystemWidgetConfigs(widgetConfigs);
    expect(result).toEqual([systemWidgetConfig]);
  });
});

describe('getRequestedWidgetConfigWithoutRuntimeConfig', () => {
  const consoleWarnMock = jest.spyOn(console, 'warn');
  const testCases: {
    hostWidgetId: string;
    requestedWidgetId: string;
    assertions: (
      result: ReturnType<typeof getRequestedWidgetConfigWithoutRuntimeConfig>,
    ) => void;
  }[] = [
    {
      hostWidgetId: 'testPlugin',
      requestedWidgetId: 'testWidget',
      assertions: (result) => {
        expect(result.requestedWidgetConfig).toEqual(widgetConfig);
        expect(result.type).toBeUndefined();
      },
    },
    {
      hostWidgetId: 'testPlugin',
      requestedWidgetId: 'pinnedWidget',
      assertions: (result) => {
        expect(result.requestedWidgetConfig).toEqual({
          ...pinnedWidgetConfig,
          version: expectedPinnedVersion,
        });
        expect(result.type).toEqual('pinned');
      },
    },
    {
      hostWidgetId: 'testPlugin',
      requestedWidgetId: notPinnedWidget.widgetId,
      assertions: (result) => {
        expect(consoleWarnMock).toHaveBeenCalledWith(
          '[platformProps.utils.widgets.get][PINNED_WIDGETS] Requested pinned widget is not a pinned widget. The 1ds shell will request the current version instead.',
        );
        expect(result.requestedWidgetConfig).toEqual(notPinnedWidget);
        expect(result.type).toBeUndefined();
      },
    },
  ];

  testCases.forEach(({ hostWidgetId, requestedWidgetId, assertions }) => {
    it(`should return requested widget config with correct widget config for ${requestedWidgetId}`, () => {
      const result = getRequestedWidgetConfigWithoutRuntimeConfig({
        hostWidgetId,
        requestedWidgetId,
        widgetConfigs,
      });

      assertions(result);
    });
  });

  it('should return empty object if the requested widget config does not exist', () => {
    const consoleErrorMock = jest.spyOn(console, 'error');
    const result = getRequestedWidgetConfigWithoutRuntimeConfig({
      hostWidgetId: 'testPlugin',
      requestedWidgetId: nonExistentWidgetId,
      widgetConfigs,
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      '[1DS][platformProps.utils.widgets.get] Unable to find requested widget config in the global WIDGET_CONFIGS map. Returning empty object.',
      {
        hostWidgetId: 'testPlugin',
        requestedWidgetId: nonExistentWidgetId,
      },
    );

    expect(result).toEqual({ requestedWidgetConfig: {} });
  });
});

describe('getPinnedWidgets', () => {
  it('should return dependsOn array for pinned widgets', () => {
    const mockWidgetConfig: WidgetConfig = {
      widgetId: '@foo/bar',
      version: '5.5.5',
      type: 'pinned',
      runtime: {
        dependsOn: {
          pinnedWidgets: [{ widgetId: '@asdf/asdf', version: '1.1.1' }],
        },
      },
    };

    const result = getPinnedWidgets(mockWidgetConfig);
    expect(result).toEqual([{ widgetId: '@asdf/asdf', version: '1.1.1' }]);
  });

  it('should return dependsOn array for pinned widgets if it exists', () => {
    const mockWidgetConfig: WidgetConfig = {
      widgetId: '@foo/bar',
      version: '5.5.5',
      type: 'pinned',
      activePhasedDeployment: false,
    } as any;

    const result = getPinnedWidgets(mockWidgetConfig);
    expect(result).toEqual([]);
  });
});
