import { NextFunction, Request } from 'express';
import httpMocks from 'node-mocks-http';

import * as env from '../../configs/env';
import { PLUGIN_DISABLED, PLUGIN_ID } from '../../constants';
import * as helpers from '../../utils/plugin-helpers';
import PluginMiddleware from '../plugin.middleware';
import { PluginConfig } from '../../types';

jest.mock('../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest
    .fn()
    .mockImplementation(() => ({ server: { knownRoutes: ['/test'] } })),
}));

describe('plugin.middleware tests', () => {
  let mockRequest: any = httpMocks.createRequest();
  let mockResponse: any;
  const nextFunction: NextFunction = jest.fn();
  const testRoute = (path: string) => {
    test(`Known path ${path} should not 404`, async () => {
      const mockRes = httpMocks.createResponse();
      mockRequest.originalUrl = path;
      const mockHelpers = jest.spyOn(helpers, 'getPluginById');

      mockHelpers.mockResolvedValue(undefined);

      await PluginMiddleware(mockRequest, mockRes, nextFunction);

      expect(mockRes.statusCode).not.toBe(404);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      protocol: 'http',
      originalUrl: '/test/123?foo=bar',
      get: jest.fn().mockImplementation((header) => {
        if (header.toLowerCase() === 'host') {
          return 'example.com:3000';
        }
        return undefined;
      }),
    };
    mockResponse = httpMocks.createResponse();
  });

  // test('get plugin from auth state', async () => {
  //   mockRequest.query = {
  //     state: JSON.stringify({
  //       widgetId: 'fakeWidgetId',
  //       redirectUri: 'fake uri',
  //     }),
  //     code: 'fakeCode',
  //   };
  //   const mock = jest.spyOn(helpers, 'getPluginById');
  //   mock.mockReturnValue(Promise.resolve({ widgetId: 'fakeWidgetId' } as any));

  //   await PluginMiddleware(mockRequest as Request, mockResponse, nextFunction);

  //   expect(mockRequest.plugin).toBeDefined();
  //   expect(mockRequest.plugin?.widgetId).toEqual('fakeWidgetId');
  // });

  test('get plugin from plugin_id param', async () => {
    mockRequest.query = {
      [PLUGIN_ID]: 'fakeWidgetId',
    };
    const mock = jest.spyOn(helpers, 'getPluginById');
    mock.mockReturnValue(Promise.resolve({ widgetId: 'fakeWidgetId' } as any));

    await PluginMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.plugin).toBeDefined();
    expect(mockRequest.plugin?.widgetId).toEqual('fakeWidgetId');
  });

  test('get plugin from path', async () => {
    mockRequest.originalUrl = '/fake';
    const mock = jest.spyOn(helpers, 'getPlugin');
    mock.mockReturnValue(Promise.resolve({ widgetId: 'fakeWidgetId' } as any));

    await PluginMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.plugin).toBeDefined();
    expect(mockRequest.plugin?.widgetId).toEqual('fakeWidgetId');
  });

  test('no plugin found, not demo/prod', async () => {
    const mock = jest.spyOn(helpers, 'getPlugin');
    mock.mockReturnValue(Promise.resolve(undefined));

    await PluginMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.plugin).toBeUndefined();
  });

  test('no plugin found in demo/prod, 404', async () => {
    mockRequest.originalUrl = '/fakePath';

    await PluginMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.plugin).not.toBeDefined();
    expect(mockResponse.statusCode).toBe(404);
  });

  describe('test disabled plugin', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockRequest = {};
      mockRequest.query = {
        [PLUGIN_ID]: 'fakeWidgetId',
      };
    });

    test('disabled plugin with baselineUrl should redirect', async () => {
      const mockRes = httpMocks.createResponse();
      const mockHelpers = jest.spyOn(helpers, 'getPluginById');
      const url = 'http://app.docusign.com';
      const baselineUrl = new URL(url);
      baselineUrl.searchParams.append(PLUGIN_DISABLED, '1');

      mockHelpers.mockReturnValue(
        Promise.resolve({
          enabled: false,
          widgetId: 'fakeWidgetId',
          baselineUrl: url,
        } as Partial<PluginConfig> as any),
      );

      await PluginMiddleware(mockRequest, mockRes, nextFunction);

      expect(mockRes._getRedirectUrl()).toBe(baselineUrl.href);
    });

    test('disabled plugin with no baselineUrl should 404', async () => {
      const mockRes = httpMocks.createResponse();
      const mockHelpers = jest.spyOn(helpers, 'getPluginById');

      mockHelpers.mockReturnValue(
        Promise.resolve({
          enabled: false,
          widgetId: 'fakeWidgetId',
          baselineUrl: '',
        } as Partial<PluginConfig> as any),
      );

      await PluginMiddleware(mockRequest, mockRes, nextFunction);

      expect(mockRes.statusCode).toBe(404);
    });

    test('disabled plugin with malformed baeslineUrl should 404', async () => {
      const mockRes = httpMocks.createResponse();
      const mockHelpers = jest.spyOn(helpers, 'getPluginById');

      mockHelpers.mockReturnValue(
        Promise.resolve({
          enabled: false,
          widgetId: 'fakeWidgetId',
          baselineUrl: 'bad url',
        } as Partial<PluginConfig> as any),
      );

      await PluginMiddleware(mockRequest, mockRes, nextFunction);

      expect(mockRes.statusCode).toBe(404);
    });

    test('plugin with no "enabled" value should continue', async () => {
      const mockRes = httpMocks.createResponse();
      const mockHelpers = jest.spyOn(helpers, 'getPluginById');

      mockHelpers.mockReturnValue(
        Promise.resolve({
          widgetId: 'fakeWidgetId',
          baselineUrl: 'mockUrl',
        } as Partial<PluginConfig> as any),
      );
      await PluginMiddleware(mockRequest, mockRes, nextFunction);

      expect(nextFunction).toBeCalled();
    });

    for (const path of ['/test']) {
      testRoute(path);
    }
  });
});
