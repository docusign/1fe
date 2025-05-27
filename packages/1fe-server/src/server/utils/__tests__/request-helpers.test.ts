import ky from 'ky';

import { Request } from 'express';
import { WidgetConfig } from '../../types';
import { generateWidgetConfigMap } from '../widget-config-helpers';
import {
  fetchRuntimeConfigsForWidgetUrlOverrides,
  getRequestHost,
} from '../request-helpers';
import { getCachedWidgetConfigs } from '../widget-config';
import { readOneFEConfigs } from '../one-fe-configs';
import { OneFEProcessedConfigs } from '../../types/one-fe-server';

const widgetConfigs = [
  { widgetId: 'widget1' },
  { widgetId: 'widget2' },
  { widgetId: 'widget3' },
] as WidgetConfig[];

const mockWidgetConfigs = generateWidgetConfigMap(widgetConfigs);

jest.mock('../widget-config', () => ({
  getCachedWidgetConfigs: jest.fn(),
}));

jest.mock('ky', () => ({
  get: jest.fn(),
}));

jest.mock('../one-fe-configs', () => ({
  readOneFEConfigs: jest.fn().mockImplementation(() => ({
    isProduction: true,
  })),
}));

describe('getRequestHost', () => {
  it('should return localhost for local development', () => {
    const req = {
      hostname: 'localhost',
      socket: {
        localPort: '3001',
      },
    } as any;

    const result = getRequestHost(req);

    expect(result.toString()).toEqual('http://localhost:3001');
  });

  it('should return host value if not in production, regardless of whitelist ', () => {
    jest
      .mocked(readOneFEConfigs)
      .mockReturnValue({ isProduction: false } as OneFEProcessedConfigs);

    const protocol = 'https';
    const hostname = 'one-ds-app.com';

    const req = {
      protocol,
      hostname,
    } as Request;

    const result = getRequestHost(req);

    expect(result.toString()).toEqual(`${protocol}://${hostname}`);
  });

  it('should return host value if in production and value is in whitelist ', () => {
    jest
      .mocked(readOneFEConfigs)
      .mockReturnValue({ isProduction: true } as OneFEProcessedConfigs);

    const protocol = 'https';
    const hostname = 'apps.dev.docusign.com';

    const req = {
      protocol,
      hostname,
    } as Request;

    const result = getRequestHost(req);

    expect(result.toString()).toEqual(`${protocol}://${hostname}`);
  });

  it('should return host value if in production and value is in whitelist, regardless of the casing', () => {
    const hostnames = [
      ['https', 'Apps-Eu.Docusign.Com'],
      ['https', 'S1-Jp.Apps.docusign.Com'],
    ];

    hostnames.forEach(([protocol, hostname]) => {
      const req = {
        protocol,
        hostname,
      } as Request;

      const result = getRequestHost(req);

      expect(result.toString()).toEqual(`${protocol}://${hostname}`);
    });
  });

  // it('should return error if in production and value is not in whitelist ', () => {

  //   const protocol = 'https';
  //   const hostname = 'x.com';

  //   const req = {
  //     protocol,
  //     hostname,
  //   } as Request;

  //   expect(() => {
  //     getRequestHost(req);
  //   }).toThrow(Error);
  // });
});

// describe('getParamFromQueryOrRedirectUri', () => {
//   const mockReq = (query: Record<string, string>): Request =>
//     ({ query } as Request);

//   const stateParamKey = 'someParam';
//   const expectedStateValue = 'someValue';

//   const stateParamValue = JSON.stringify({
//     redirectUri: `/path/to/thing?${stateParamKey}=${expectedStateValue}`,
//   });

//   it('should return the query param value if present in req.query', () => {
//     const req = mockReq({ [stateParamKey]: expectedStateValue });
//     const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
//     expect(result).toBe(expectedStateValue);
//   });

//   it('should return the query param value if present in state redirect URI', () => {
//     const req = mockReq({ [STATE]: stateParamValue });
//     const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
//     expect(result).toBe(expectedStateValue);
//   });

//   it('root level param should have presidence over the one in state', () => {
//     const req = mockReq({
//       [STATE]: stateParamValue,
//       [stateParamKey]: 'someOtherValue',
//     });
//     const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
//     expect(result).toBe('someOtherValue');
//   });

//   it('should return null if the query param is not present', () => {
//     const req = mockReq({});
//     const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
//     expect(result).toBeNull();
//   });

//   it('should return null if the state redirect URI is malformed', () => {
//     const req = mockReq({ state: 'invalid JSON' });
//     const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
//     expect(result).toBeNull();
//   });
// });

describe('fetchRuntimeConfigsForWidgetUrlOverrides', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getCachedWidgetConfigs).mockReturnValue(mockWidgetConfigs);
  });

  it('should not fetch runtime configs if widget is missing from cached configs', async () => {
    const widgetUrlOverrides = {
      '@ds/ui': `http://example/cdn/libraries/js/1fe-bundle.js`,
    };

    const result =
      await fetchRuntimeConfigsForWidgetUrlOverrides(widgetUrlOverrides);

    expect(ky.get).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('should fetch runtime configs for widget URL overrides if valid cdn', async () => {
    const widgetUrlOverrides = {
      widget1: `http://example/cdn/widgets/js/1fe-bundle.js`,
      widget2: `http://example/cdn/widgets/js/1fe-bundle.js`,
      // widget3: 'https://invalid.com/js/1fe-bundle.js',
    };

    (ky.get as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ someConfig: 1 }),
    });

    (ky.get as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ someConfig: 2 }),
    });

    const result =
      await fetchRuntimeConfigsForWidgetUrlOverrides(widgetUrlOverrides);

    expect(ky.get).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      widget1: { someConfig: 1 },
      widget2: { someConfig: 2 },
    });
  });

  it('should handle errors and return partial results', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error');
    const widgetUrlOverrides = {
      widget1: `http://example/cdn/widgets/js/1fe-bundle.js`,
      widget2: `http://example/cdn/widgets/js/1fe-bundle.js`,
    };

    (ky.get as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ someConfig: 1 }),
    });

    (ky.get as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    const result =
      await fetchRuntimeConfigsForWidgetUrlOverrides(widgetUrlOverrides);

    expect(ky.get).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      widget1: { someConfig: 1 },
    });

    const message =
      '[1FE][WIDGET_URL_OVERRIDES][fetchRuntimeConfigsForWidgetUrlOverrides] Failed to fetch runtime configs for widgets';

    const error = [new Error('Fetch failed')];

    expect(consoleErrorMock).toHaveBeenCalledWith(message, error);
  });
});
