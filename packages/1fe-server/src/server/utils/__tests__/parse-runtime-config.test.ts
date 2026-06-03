import { RuntimeConfig, WidgetConfig } from '../../types';
import {
  DISALLOWED_TEMPLATE_SYNTAX_ERROR,
  parseRuntimeConfig,
} from '../runtime-configs';

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

  describe('security: template injection prevention', () => {
    it('throws on disallowed token (process.exit)', () => {
      expect(() =>
        parseRuntimeConfig({
          runtimeConfig: {
            preload: [{ apiGet: '<%= process.exit(1) %>' }],
          },
          widgetConfig: widgetConfig as WidgetConfig,
        }),
      ).toThrow(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
    });

    it('throws on constructor-based RCE payload', () => {
      expect(() =>
        parseRuntimeConfig({
          runtimeConfig: {
            preload: [
              {
                apiGet:
                  '<%= constructor.constructor("return process.exit(1)")() %>',
              },
            ],
          },
          widgetConfig: widgetConfig as WidgetConfig,
        }),
      ).toThrow(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
    });

    it('throws on execute block (<% %>)', () => {
      expect(() =>
        parseRuntimeConfig({
          runtimeConfig: {
            preload: [{ apiGet: '<% process.exit(1) %>' }],
          },
          widgetConfig: widgetConfig as WidgetConfig,
        }),
      ).toThrow(DISALLOWED_TEMPLATE_SYNTAX_ERROR);
    });

    it('allows valid tokens', () => {
      const result = parseRuntimeConfig({
        runtimeConfig: {
          preload: [
            {
              apiGet:
                'https://cdn.example.com/<%= ENVIRONMENT %>/<%= WIDGET_ID %>/<%= WIDGET_VERSION %>',
            },
          ],
        },
        widgetConfig: widgetConfig as WidgetConfig,
      });

      expect(result.preload?.[0].apiGet).toEqual(
        `https://cdn.example.com/${environment}/${widgetConfig.widgetId}/${widgetConfig.version}`,
      );
    });
  });
});
