// import { getIsColdStart } from '../../app';
import ky from 'ky';
import { generateWidgetConfigMap, getWidgetConfigValues, mapAndGenerateWidgetConfigMap } from '../widget-config-helpers';
import { RuntimeConfig, WidgetConfig } from '../../types';
import * as runtimeConfigs from '../runtime-configs';

const { _fetchSingleWidgetRuntimeConfig, fetchAllWidgetRuntimeConfigs } = runtimeConfigs;

// jest.mock('../../app', () => ({
//   getIsColdStart: jest.fn(),
// }));

jest.mock('ky', () => ({
  get: jest.fn()
}));

const runtimeConfig: RuntimeConfig = {
  preload: [
    {
      apiGet:
        // not using a real example url because template literals break equality checks
        'https://docutest-a.akamaihd.net/some/stuff',
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

const mockedBadWidgetConfigs = generateWidgetConfigMap<WidgetConfig>([
  // @ts-expect-error this is intentionally missing runtime config
  {
    widgetId: '@1ds/widget-starter-kit',
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/starter-kit',
    },
  },
  // @ts-expect-error this is intentionally missing runtime config
  {
    widgetId: 'test/pluginId',
    version: '0.0.0',
    plugin: {
      enabled: true,
      route: '/test',
    },
  },
  // @ts-expect-error this is intentionally missing runtime config
  {
    widgetId: 'test/widgetId',
    version: '0.0.0',
  },
]);

const mockCachedWidgetConfigs = mapAndGenerateWidgetConfigMap(
  mockedBadWidgetConfigs,
  (widgetConfig) => ({ ...widgetConfig, runtime: runtimeConfig }),
);

jest.mock('../widget-config', () => ({
  getCachedWidgetConfigs: () => mockCachedWidgetConfigs,
}));

const generateruntimeConfigCdnUrlMock = jest.spyOn(
  runtimeConfigs,
  'generateRuntimeConfigCDNUrl',
);

const mockResponse500 = {
  status: 503,
  json: () => Promise.resolve({ error: 'Internal Server Error' }),
} as Response;

const mockResponse200 = {
  status: 200,
  json: () => Promise.resolve(runtimeConfig),
} as Response;

const mockResponse400 = {
  status: 404,
  json: () => Promise.resolve({ error: 'Not Found' }),
} as Response;

describe('fetchAllWidgetRuntimeConfigs', () => {
  it('should fallback on 4xx and update on 2xx', async () => {
    jest.mocked(ky.get)
      .mockResolvedValueOnce({
          status: 400,
          json: async () => ({
            data: 'Something is not right',
          }),
        } as Response
      )
      .mockResolvedValueOnce({
          status: 400,
          json: async () => ({
            data: 'Something is not right',
          }),
        } as Response,
      )
      .mockResolvedValueOnce({
          status: 200,
          json: async () => ({ ...runtimeConfig, dependsOn: ['@ds/prepare'] }),
        } as Response,
      );

    const newWidgetConfigs = await fetchAllWidgetRuntimeConfigs(
      mockedBadWidgetConfigs,
    );

    // fell back to cache
    expect(getWidgetConfigValues(newWidgetConfigs)[0]).toEqual(
      getWidgetConfigValues(mockCachedWidgetConfigs)[0],
    );

    // fell back to cache
    expect(getWidgetConfigValues(newWidgetConfigs)[1]).toEqual(
      getWidgetConfigValues(mockCachedWidgetConfigs)[1],
    );
  });

  it('should fallback if fetch runtime configs returns 4xx', async () => {
    jest.mocked(ky.get).mockResolvedValueOnce({
        status: 400,
        json: async () => ({
          data: 'Something is not right',
        }),
      } as Response,
    );

    const newWidgetConfigs = await fetchAllWidgetRuntimeConfigs(
      mockedBadWidgetConfigs,
    );

    expect(newWidgetConfigs).toEqual(mockCachedWidgetConfigs);
  });

  it('should fallback to cache if generateRuntimeConfigCDNUrl throws an exception', async () => {
    generateruntimeConfigCdnUrlMock.mockImplementationOnce(() => {
      throw 'Something went wrong';
    });

    const newWidgetConfigs = await fetchAllWidgetRuntimeConfigs(
      mockedBadWidgetConfigs,
    );

    expect(newWidgetConfigs).toEqual(mockCachedWidgetConfigs);
  });
});

describe('_fetchSingleWidgetRuntimeConfig', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(runtimeConfigs, 'getIsColdStart').mockReturnValue(true);
  });

  it('should return updated widgetConfig with runtime config on 2xx', async () => {
    jest.mocked(ky.get).mockResolvedValue(mockResponse200);

    const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
      widgetConfig: getWidgetConfigValues(mockCachedWidgetConfigs)[0],
    });

    expect(newWidgetConfig.runtime).toEqual(runtimeConfig);
    expect(ky.get).toHaveBeenCalledTimes(1);
  });

  it('should retry on 5xx and use fallback runtime config if fetch returns 4xx', async () => {
    for (let i = 0; i < 9; i++) {
      jest.mocked(ky.get).mockResolvedValueOnce(mockResponse500);
    }

    jest.mocked(ky.get).mockResolvedValueOnce(mockResponse400);

    const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
      widgetConfig: getWidgetConfigValues(mockCachedWidgetConfigs)[0],
    });

    // assuming the fallback runtime config is an empty object
    expect(newWidgetConfig.runtime).toEqual(
      getWidgetConfigValues(mockCachedWidgetConfigs)[0].runtime,
    );
    expect(ky.get).toHaveBeenCalledTimes(10);
  });

  it('should retry on cold start 5xx and update on 2xx', async () => {
    for (let i = 0; i < 9; i++) {
      jest.mocked(ky.get).mockResolvedValueOnce(mockResponse500);
    }

    jest.mocked(ky.get).mockResolvedValueOnce(mockResponse200);

    const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
      widgetConfig: {
        ...getWidgetConfigValues(mockCachedWidgetConfigs)[0],
        runtime: {},
      },
    });

    expect(newWidgetConfig.runtime).toEqual(runtimeConfig);
    expect(ky.get).toHaveBeenCalledTimes(10);
  });

  it('should retry 3 times and then fallback on 5xx after startup', async () => {
    jest.spyOn(runtimeConfigs, 'getIsColdStart').mockReturnValueOnce(false);

    jest.mocked(ky.get)
      .mockResolvedValueOnce(mockResponse500)
      .mockResolvedValueOnce(mockResponse500);

    const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
      widgetConfig: {
        ...getWidgetConfigValues(mockCachedWidgetConfigs)[0],
        runtime: {},
      },
    });

    // expect runtimeConfig instead of {} because of fallback to latest stale,
    // which came from getCachedWidgetConfigs, mocked to return getWidgetConfigValues(mockCachedWidgetConfigs)
    expect(newWidgetConfig.runtime).toEqual(runtimeConfig);
    expect(ky.get).toHaveBeenCalledTimes(2);
  });

  // it('should fallback on cold start 5xx if getEnableInfiniteRuntimeConfigFetchRetryOn5xx is false and isColdStart is true', async () => {
  //   for (let i = 0; i < 9; i++) {
  //     jest.mocked(ky.get).mockResolvedValueOnce(mockResponse500);
  //   }

  //   jest.mocked(ky.get).mockResolvedValueOnce(mockResponse200);

  //   const newWidgetConfig = await _fetchSingleWidgetRuntimeConfig({
  //     widgetConfig: {
  //       ...getWidgetConfigValues(mockCachedWidgetConfigs)[0],
  //       runtime: {},
  //     },
  //   });

  //   expect(newWidgetConfig.runtime).toEqual(runtimeConfig);
  //   expect(ky.get).toHaveBeenCalledTimes(1);
  // });
});
