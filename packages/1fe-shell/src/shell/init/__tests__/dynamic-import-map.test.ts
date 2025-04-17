import { DYNAMIC_CONFIGS } from '../../configs/config-helpers';
import { WIDGET_URL_OVERRIDES } from '../../constants/search-params';
import { getShellPlatformUtils } from '../../utils/shell-platform-utils';
import * as utils from '../../utils/url';
import * as importMap from '../import-map';

const { createDynamicImportMap, getQueryURLParams, getUrlWidgetOverrides } =
  importMap;
// import { createDynamicImportMap, getQueryURLParams, getUrlWidgetOverrides } from '../import-map';

// jest.mock('../runtime-config-overrides', () => ({
//   applyRuntimeConfigOverridesForWidgetUrlOverrides: jest.fn(),
// }));

// jest.mock('../import-map', () => ({
//   ...jest.requireActual('../import-map'),
//   getQueryURLParams: jest.fn(),
// }));

jest.mock('../../utils/shell-platform-utils', () => ({
  getShellPlatformUtils: jest.fn(),
}));

jest.mock('lottie-react', () => ({
  Lottie: () => null,
}));

jest.mock('../../components/Router', () => ({
  router: {
    navigate: jest.fn(),
  },
}));

jest.mock('../../configs/config-helpers', () => ({
  LAZY_LOADED_LIB_CONFIGS: { lazy: 'lazy_config' },
  WIDGET_CONFIGS: jest.fn(),
  DYNAMIC_CONFIGS: {
    importMapOverrides: {
      allowedSources: [
        'localhost',
        '127.0.0.1',
        'docucdn-a.akamaihd.net',
        'docutest-a.akamaihd.net',
      ],
    },
  },
  getWidgetConfigValues: jest
    .fn()
    .mockReturnValue([
      { widgetId: 'mock_widget_id' },
      { widgetId: 'system_widget_id', _url: 'mock_url' },
    ]),
}));

jest.mock('../../utils/runtime-configs', () => ({
  getParsedRuntimeConfigOverrides: jest.fn(),
}));

describe('getUrlWidgetOverrides', () => {
  beforeAll(() => {
    jest.clearAllMocks();

    jest
      .spyOn(utils, 'generateCDNUrl')
      .mockReturnValue(new URL('http://mock_cdn_url.com'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ensures the override is found in the query params', () => {
    const overrides = {
      widgetId: 'mock_override_url',
    };

    jest
      .spyOn(importMap, 'getQueryURLParams')
      .mockReturnValueOnce(
        new URLSearchParams(
          `${WIDGET_URL_OVERRIDES}=${JSON.stringify(overrides)}`,
        ),
      );

    // jest
    //   .mocked(getQueryURLParams)
    //   .mockReturnValueOnce(
    //     new URLSearchParams(
    //       `${WIDGET_URL_OVERRIDES}=${JSON.stringify(overrides)}`,
    //     ),
    //   );
    expect(getUrlWidgetOverrides()).toEqual(overrides);
  });

  it("ensures the override is found in the account server's state query params", () => {
    const overrides = {
      '@ds/send': 'http://127.0.0.1/js/1fe-bundle.foobar.js',
    };

    const authServerMockReturn = `authenticate?code=eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiZmZhYjYyYmEtYTRhNy00NjhjLWJhOGEtNDEwMmM0NGFkYjA2In0.AQoAAAABAAYABwCAfEXlocXbSAgAgAjMLKLF20gCABzA4QpkmchPggxLk8F2PMQVAAEAAAAYABQAAAAFAAAAUQAAADcAAABlAAAAfwAAAHoAAACFAAAAhgAAAGsAAABsAAAAwgAAAAYAAAAJAQAADwEAAOsAAAA-AQAA8QAAADQBAACYAAAAOAAAAA0AJAAAADJjYzU2ZGM5LTRiY2QtNGI1NS04YWIwLThiYTYwYmFlMTA2NSIAJAAAADJjYzU2ZGM5LTRiY2QtNGI1NS04YWIwLThiYTYwYmFlMTA2NTcAAGjZeniw6EixUXfO8IPrnTAAAMbD9J_F20g.dpKd8M1WCO5iJB7AysPu9xLwCCxCSOD2nTfBuOZjnDlnzt5pXthqQVTMzG8gJjcT6gMqcMUfcOlOVLt8sBVgfYX1oMB7vDiCtlYquXR14BgGA8wNegmV-SjJ2-EStE7NowiAAgYuURsQ1oFMzV2gX9MxBR1U1_RwyPFEtT9kb5x4MvjovpvUbhnvuHkBOdv0DKwukc88p8cyuTu6VcZ5dGu-Sb5QHIMeokHTHawtILmccJisGMyHX_7y4goyE0bm4F4PKxdGoIZioQ4Js61Lzx45CpVvDk-SXpIX5Xasc6QudEeqFmNlRYG70sWsJfptqTgkTgIRH-iTIhWgESyyxA&state={%22widgetId%22%3A%22%40ds%2Fsend%22%2C%22xsrfToken%22%3A%22Z60fqHX23bYdB%2FOgTMFgL8W5ucqr0bMU3SbW4Uu4INcjZaNK82b1WkkxWC8uHY1W9uYkC8nfk3um8BfsSRamfNVyKpjfOfcgWsilsYpabk34NLx5N%2FDE6NYqlCWB3XmgC3f5Q05lHk3QjeAvxv8qLtNIZ188kVM4th0g7Vd5TTo%3D%22%2C%22redirectUri%22%3A%22%2Fsend%3Fwidget_url_overrides%3D{%2522%40ds%2Fsend%2522%3A%2520%2522http%3A%2F%2F127.0.0.1%2Fjs%2F1fe-bundle.foobar.js%2522}%22}`;

    jest
      .spyOn(importMap, 'getQueryURLParams')
      .mockReturnValueOnce(
        new URLSearchParams(authServerMockReturn?.split('?')[1]),
      );
    expect(getUrlWidgetOverrides()).toEqual(overrides);
  });
});

describe('createDynamicImportMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(getShellPlatformUtils).mockReturnValue({
      localStorage: {
        get: jest.fn(),
        set: jest.fn(),
        keys: jest.fn(),
        getAll: jest.fn(),
      },
    } as unknown as ReturnType<typeof getShellPlatformUtils>);

    const mockUtils = jest.spyOn(utils, 'generateCDNUrl');

    mockUtils.mockReturnValue(new URL('http://mock_cdn_url.com'));
  });

  it('createDynamicImportMap should return expected output', async () => {
    const retValue = createDynamicImportMap();

    expect(retValue).toStrictEqual({
      importMap: {
        imports: {
          lazy: 'lazy_config',
          mock_widget_id: 'http://mock_cdn_url.com/',
          system_widget_id: 'http://mock_cdn_url.com/',
        },
        scopes: {},
      },
    });
  });

  it('createDynamicImportMap should include url override', async () => {
    jest.spyOn(importMap, 'getQueryURLParams').mockReturnValueOnce(
      new URLSearchParams(
        `${WIDGET_URL_OVERRIDES}=${JSON.stringify({
          widgetId: 'https://docucdn-a.akamaihd.net/widget_id',
        })}`,
      ),
    );
    const retValue = createDynamicImportMap();

    expect(retValue.overrides).toStrictEqual({
      widgetId: 'https://docucdn-a.akamaihd.net/widget_id',
    });
  });

  it('createDynamicImportMap invalid override should noop', async () => {
    jest
      .spyOn(importMap, 'getQueryURLParams')
      .mockReturnValueOnce(
        new URLSearchParams(`${WIDGET_URL_OVERRIDES}=invalid_json`),
      );
    const retValue = createDynamicImportMap();

    expect(retValue.overrides).toBeUndefined();
  });

  it.each([
    'https://cdnjs.cloudflare.com/ajax/libs/bitcoin-miner',
    'https://docucdn-a.akamaihd.net@bad-site.com/bad/path',
    'https://docucdn-a.akamaihd.net.badsite@bad-site.com/bad/path',
    'https://127.0.0.1@bad-site.com/bad/path',
    'https://127.0.0.1@bad-site.:8000com/bad/path',
    'https://127.0.0.1:8000@bad-site.com/bad/path',
  ])(
    'should restrict overrides if source is NOT in allowedWidgetOverrideUrlHostnames whitelist',
    (maliciousUrls) => {
      const widgetUrlOverrides = {
        react: maliciousUrls,
      };
      jest
        .spyOn(importMap, 'getQueryURLParams')
        .mockReturnValueOnce(
          new URLSearchParams(
            `${WIDGET_URL_OVERRIDES}=${JSON.stringify(widgetUrlOverrides)}`,
          ),
        );

      const {
        importMap: { imports },
        overrides,
      } = createDynamicImportMap();

      expect(imports).not.toEqual(expect.objectContaining(widgetUrlOverrides));
      expect(overrides).not.toEqual(
        expect.objectContaining(widgetUrlOverrides),
      );
    },
  );

  it.each([
    'https://127.0.0.1:8000/good/path',
    'https://docucdn-a.akamaihd.net/good/path',
    'https://docutest-a.akamaihd.net/good/path',
    'https://localhost:8080/good/path',
  ])(
    'should not restrict overrides if source is in allowedWidgetOverrideUrlHostnames whitelist',
    (maliciousUrls) => {
      const widgetUrlOverrides = {
        react: maliciousUrls,
      };
      jest
        .spyOn(importMap, 'getQueryURLParams')
        .mockReturnValueOnce(
          new URLSearchParams(
            `${WIDGET_URL_OVERRIDES}=${JSON.stringify(widgetUrlOverrides)}`,
          ),
        );

      const {
        importMap: { imports },
        overrides,
      } = createDynamicImportMap();

      expect(imports).toEqual(expect.objectContaining(widgetUrlOverrides));
      expect(overrides).toEqual(expect.objectContaining(widgetUrlOverrides));
    },
  );
});
