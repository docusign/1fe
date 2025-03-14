import { RuntimeConfig, WidgetConfig } from '../../types';
import { parseRuntimeConfig } from '../runtime-configs';

jest.mock('ky', () => ({
  get: jest.fn().mockReturnValue({}),
}));

jest.mock('../one-fe-configs', () => ({
  readOneFEConfigs: jest.fn().mockImplementation(() => ({
    environment: 'integration',
  })),
}));

const runtimeConfig: RuntimeConfig = {
  preload: [
    {
      apiGet:
        'https://docutest-a.akamaihd.net/<%= ENVIRONMENT %>/<%= WIDGET_ID %>/<%= WIDGET_VERSION%>/helloWorld.json',
    },
    {
      apiGet:
        '"https://docutest-a.akamaihd.net/integration/ndse/latest/translations/locale-en.json"',
    },
    {
      widget: '@ds/prepare',
    },
  ],
};

const widgetConfig: Partial<WidgetConfig> = {
  version: '1.0.0',
  widgetId: '@ds/awesome-widget',
};

const environment = 'integration';

describe('parseRuntimeConfig', () => {
  it('replaces variables in <%= %> and nothing else', () => {
    const originalPreload = runtimeConfig?.preload;
    const parsedPreload = parseRuntimeConfig({
      runtimeConfig,
      widgetConfig: widgetConfig as WidgetConfig,
    })?.preload;

    // changed
    expect(parsedPreload?.[0].apiGet).toEqual(
      `https://docutest-a.akamaihd.net/${environment}/${widgetConfig.widgetId}/${widgetConfig.version}/helloWorld.json`,
    );

    // unchanged
    expect(parsedPreload?.[1].apiGet).toEqual(originalPreload?.[1].apiGet);

    // unchanged
    expect(parsedPreload?.[2].widget).toEqual(originalPreload?.[2].widget);
  });

  it('returns empty object if given empty runtime config', () => {
    const parsedPreload = parseRuntimeConfig({
      runtimeConfig: {},
      widgetConfig: widgetConfig as WidgetConfig,
    });

    expect(parsedPreload).toMatchObject({});
  });
});
