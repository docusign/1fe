import { jest } from '@jest/globals';
import { Request } from 'express';

import {
  getWidgetConfigsForIndexHtml,
  _overrideRuntimeConfigs,
  validateWidgetConfig,
} from '../widget-config';
import {
  RUNTIME_CONFIG_OVERRIDES,
  WIDGET_URL_OVERRIDES,
} from '../../../constants';
import { fetchRuntimeConfigsForWidgetUrlOverrides } from '../../../utils/request-helpers';
import { RuntimeConfig, WidgetConfig } from '../../../types';
import { getParamFromQueryOrRedirectUri } from '../../../utils/url';
import {
  convertServerWidgetConfigToShellWidgetConfig,
  generateWidgetConfigMap,
} from '../../../utils';
import { readOneFEConfigs } from '../../../utils/one-fe-configs';
import { OneFEProcessedConfigs } from '../../../types/one-fe-server';

const cachedWidgetConfig = generateWidgetConfigMap([
  { widgetId: 'widget1', runtime: { key: 'cached-value' } },
  { widgetId: 'widget2', runtime: { key: 'cached-value' } },
  { widgetId: 'widget3', runtime: { key: 'cached-value' } },
] as unknown as WidgetConfig[]);

jest.mock('ky', () => ({
  create: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../utils/url', () => ({
  getParamFromQueryOrRedirectUri: jest.fn(),
}));

jest.mock('../../../utils/request-helpers', () => ({
  fetchRuntimeConfigsForWidgetUrlOverrides: jest.fn(),
}));

jest.mock('../../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest
    .fn()
    .mockImplementation(() => ({ mode: 'preproduction' })),
}));

jest.mock('../../../utils/widget-config', () => ({
  getCachedWidgetConfigs: () => cachedWidgetConfig,
}));

describe('getWidgetConfigsForIndexHtml', () => {
  let widgetUrlOverrides: string | null = null;
  let runtimeConfigOverrides: string | null = null;

  beforeEach(() => {
    jest.resetAllMocks();
    widgetUrlOverrides = null;
    runtimeConfigOverrides = null;

    jest
      .mocked(getParamFromQueryOrRedirectUri)
      .mockImplementation((req, key) => {
        switch (key) {
          case RUNTIME_CONFIG_OVERRIDES:
            return runtimeConfigOverrides;
          case WIDGET_URL_OVERRIDES:
            return widgetUrlOverrides;
          default:
            return null;
        }
      });
  });

  // the req arg doesn't matter in these tests, it is passed to the mocked getParamFromQueryOrRedirectUri
  const dummyReqArg = {} as Request;

  it('should return cached configs if no runtime_config_overrides or widget_url_overrides', async () => {
    const result = await getWidgetConfigsForIndexHtml(dummyReqArg);

    expect(result).toEqual(cachedWidgetConfig);
  });

  it('should return overridden configs if runtime_config_overrides query param is present and environment is preprod', async () => {
    jest.mocked(readOneFEConfigs).mockReturnValue({ mode: 'preproduction' } as OneFEProcessedConfigs);

    const expectedRuntime = { key: 'new-value' };
    runtimeConfigOverrides = JSON.stringify({
      widget1: expectedRuntime,
    });

    const expectedConfigs = generateWidgetConfigMap([
      { widgetId: 'widget1', runtime: expectedRuntime },
      { widgetId: 'widget2', runtime: { key: 'cached-value' } },
      { widgetId: 'widget3', runtime: { key: 'cached-value' } },
    ] as unknown as WidgetConfig[]);

    const result = await getWidgetConfigsForIndexHtml(dummyReqArg);

    expect(result).toEqual(expectedConfigs);
  });

  [true, false].forEach((isProd) => {
    it(`1) should return cached configs if widget_url_overrides query param is present in any env and 2) runtime_config_overrides takes precedence on preprod - isProd - ${isProd}`, async () => {
      widgetUrlOverrides =
        '{"widget1": "https://example.com", "widget3": "https://example.com"}';
      runtimeConfigOverrides = JSON.stringify({
        widget3: { key: 'new-runtimeConfigOverride-value' },
      });
      const expectedWidgetUrlRuntimeConfigOverrides = {
        widget1: { key: 'new-widgetUrlOverride-value' },
        widget3: { key: 'new-widgetUrlOverride-value' },
      } as Record<string, RuntimeConfig>;

      jest
        .mocked(readOneFEConfigs)
        .mockReturnValue({ mode: isProd ? 'production' : 'preproduction' } as OneFEProcessedConfigs);
      jest
        .mocked(fetchRuntimeConfigsForWidgetUrlOverrides)
        .mockReturnValue(
          Promise.resolve(expectedWidgetUrlRuntimeConfigOverrides),
        );

      const expectedMap = new Map(cachedWidgetConfig)
        .set('widget1', {
          ...(cachedWidgetConfig.get('widget1') as WidgetConfig),
          runtime: expectedWidgetUrlRuntimeConfigOverrides.widget1,
        })
        .set('widget3', {
          ...(cachedWidgetConfig.get('widget3') as WidgetConfig),
          runtime: {
            key: !isProd
              ? 'new-runtimeConfigOverride-value'
              : 'new-widgetUrlOverride-value',
          } as RuntimeConfig,
        });

      const result = await getWidgetConfigsForIndexHtml(dummyReqArg);

      expect(result).toEqual(expectedMap);

      expect(fetchRuntimeConfigsForWidgetUrlOverrides).toHaveBeenCalledWith(
        JSON.parse(widgetUrlOverrides),
      );
    });
  });
});

describe('validateWidgetConfig', () => {
  it('should return false for invalid widgetConfig', () => {
    const invalidConfigs = [null, undefined, {}, { runtime: 'not-an-object' }];

    // this is intentionally wrong
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invalidConfigs.forEach((config: any) => {
      expect(validateWidgetConfig(config)).toBe(false);
    });
  });

  it('should return true for valid widgetConfig', () => {
    const validConfig = {
      runtime: {},
    } as WidgetConfig;

    expect(validateWidgetConfig(validConfig)).toBe(true);
  });
});

describe('_overrideRuntimeConfigs', () => {
  it('should override runtime configs based on widgetId', () => {
    const runtimeConfigOverrides = JSON.parse(
      '{"widget1": {"key": "new-value"}}',
    );
    const widgetConfigs = generateWidgetConfigMap([
      {
        widgetId: 'widget1',
        runtime: { key: 'old-value' },
      },
      { widgetId: 'widget2', runtime: { key: 'value' } },
    ] as unknown as WidgetConfig[]);

    const expectedConfigs = generateWidgetConfigMap([
      { widgetId: 'widget1', runtime: { key: 'new-value' } },
      { widgetId: 'widget2', runtime: { key: 'value' } },
    ] as unknown as WidgetConfig[]);

    expect(
      _overrideRuntimeConfigs(runtimeConfigOverrides, widgetConfigs),
    ).toEqual(expectedConfigs);
  });
});

// describe('setInWidgetAndSanitize', () => {
//   it('should sanitize widget without _url', () => {
//     const sanitizedWidget = setInWidgetAndSanitize(
//       widgetConfigPayload.find((w) => w.widgetId === 'testwidget')!,
//       '1.2.3',
//     );
//     expect(
//       sanitizedWidget['environments' as keyof typeof sanitizedWidget],
//     ).toBe(undefined);
//   });
//   it('should sanitize widget with _url', () => {
//     const _url = 'https://google.com';
//     const sanitizedWidget = setInWidgetAndSanitize(
//       widgetConfigPayload.find((w) => w.widgetId === 'testwidget')!,
//       '1.2.3',
//       true,
//       _url,
//     );
//     expect(
//       sanitizedWidget['environments' as keyof typeof sanitizedWidget],
//     ).toBe(undefined);
//   });
// });

const serverWidgetConfigPayload = generateWidgetConfigMap<WidgetConfig>([
  {
    widgetId: 'send',
    version: '1.2.3',
    plugin: {
      enabled: true,
      route: 'send',
    },
    runtime: {
      plugin: {
        auth: {
          authenticationType: 'required',
          scopes: ['signature', 'me_profile', 'webforms_manage'],
          useNativeAuth: true,
          clientAppId: 'asdf',
          callbackUri: 'asdf',
        },
        metaTags: [
          { name: 'title', content: 'Docusign App Center' },
          { name: 'description', content: 'Extension apps for all' },
          {
            name: 'keywords',
            content: 'docusign, app center, extension, apps',
          },
          { name: 'robots', content: 'index, follow' },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
          { name: 'revisit-after', content: '20 days' },
          { name: 'language', content: 'en-US' },
          {
            'http-equiv': 'content-type',
            content: 'text/html; charset=utf-8',
          },
          { 'http-equiv': 'content-security-policy', content: 'IE=edge' },
        ],
      },
    },
  },
  {
    widgetId: 'prepare',
    version: '3.2.3',
    plugin: {
      enabled: true,
      route: 'prepare',
    },
    runtime: {
      preload: [
        {
          widget: 'prepare',
        },
        {
          apiGet: '/api/prepare',
        },
      ],
      plugin: {
        auth: {
          authenticationType: 'required',
          scopes: ['signature', 'me_profile', 'webforms_manage'],
          useNativeAuth: true,
          clientAppId: 'asdf',
          callbackUri: 'asdf',
        },
        metaTags: [
          { name: 'title', content: 'Docusign App Center' },
          { name: 'description', content: 'Extension apps for all' },
          {
            name: 'keywords',
            content: 'docusign, app center, extension, apps',
          },
          { name: 'robots', content: 'index, follow' },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
          { name: 'revisit-after', content: '20 days' },
          { name: 'language', content: 'en-US' },
          {
            'http-equiv': 'content-type',
            content: 'text/html; charset=utf-8',
          },
          { 'http-equiv': 'content-security-policy', content: 'IE' },
        ],
      },
    },
  },
]);

describe('convertServerWidgetConfigToShellWidgetConfig', () => {
  it('should strip out unnecessary keys', () => {
    const convertedWidgetConfig = convertServerWidgetConfigToShellWidgetConfig(
      serverWidgetConfigPayload,
    );

    expect(convertedWidgetConfig).toEqual([
      {
        widgetId: 'send',
        version: '1.2.3',
        plugin: {
          enabled: true,
          route: 'send',
        },
        runtime: {
          plugin: {
            auth: {
              authenticationType: 'required',
              scopes: ['signature', 'me_profile', 'webforms_manage'],
              useNativeAuth: true,
              clientAppId: 'asdf',
              callbackUri: 'asdf',
            },
          },
        },
      },
      {
        widgetId: 'prepare',
        version: '3.2.3',
        plugin: {
          enabled: true,
          route: 'prepare',
        },
        runtime: {
          plugin: {
            auth: {
              authenticationType: 'required',
              scopes: ['signature', 'me_profile', 'webforms_manage'],
              useNativeAuth: true,
              clientAppId: 'asdf',
              callbackUri: 'asdf',
            },
          },
          preload: [
            {
              widget: 'prepare',
            },
            {
              apiGet: '/api/prepare',
            },
          ],
        },
      },
    ]);
  });
});
