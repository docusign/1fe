import { Request, Response } from 'express';
import { getHostedOrSimulatedEnvironment } from '../../configs';
import IndexController, {
  allowUnsafeEvalForSystemPluginsOnPreprod,
  ifSystemPluginRequestedOnProd,
  getSystemWidgetConfigs
} from '../index.controller';
import * as indexControllerModule from '../index.controller';
// import { ACTIVE_AUTOMATED_TEST_FRAMEWORK } from '../../constants';

jest.mock('ky', () => ({
  create: jest.fn().mockReturnValue({}),
}));

jest.mock<typeof import('../../configs/env')>('../../configs/env');

describe('allowUnsafeEvalForSystemPluginsOnPreprod', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if not prod and there is a match', () => {
    jest
      .mocked(getHostedOrSimulatedEnvironment)
      .mockReturnValueOnce('integration');
    jest.spyOn(indexControllerModule, 'getSystemWidgetConfigs').mockReturnValue([
      { type: 'system', version: '5.5.5', widgetId: '@ds/foo' },
      { type: 'system', version: '5.5.5', widgetId: '@ds/bar' },
    ]);

    const result = allowUnsafeEvalForSystemPluginsOnPreprod({
      route: '/foo',
      widgetId: '@ds/foo',
      enabled: true,
    });

    expect(result).toBe(true);
  });

  it('should return false if not prod and there is no match', () => {
    jest
      .mocked(getHostedOrSimulatedEnvironment)
      .mockReturnValueOnce('integration');
    jest.spyOn(indexControllerModule, 'getSystemWidgetConfigs').mockReturnValue([
      { type: 'system', version: '5.5.5', widgetId: '@ds/baz' },
      { type: 'system', version: '5.5.5', widgetId: '@ds/bar' },
    ]);

    const result = allowUnsafeEvalForSystemPluginsOnPreprod({
      route: '/foo',
      widgetId: '@ds/foo',
      enabled: true,
    });

    expect(result).toBe(false);
  });
});

describe('ifSystemPluginRequestedOnProd', () => {
  it('should return false if not prod and and there is no match', () => {
    jest
      .mocked(getHostedOrSimulatedEnvironment)
      .mockReturnValueOnce('integration');
    jest.spyOn(indexControllerModule, 'getSystemWidgetConfigs').mockReturnValue([
      { type: 'system', version: '5.5.5', widgetId: '@ds/baz' },
      { type: 'system', version: '5.5.5', widgetId: '@ds/bar' },
    ]);

    const result = ifSystemPluginRequestedOnProd({
      route: '/foo',
      widgetId: '@ds/foo',
      enabled: true,
    });

    expect(result).toBe(false);
  });

  it('should return false if not prod and and there is a match', () => {
    jest
      .mocked(getHostedOrSimulatedEnvironment)
      .mockReturnValueOnce('integration');
    jest.spyOn(indexControllerModule, 'getSystemWidgetConfigs').mockReturnValue([
      { type: 'system', version: '5.5.5', widgetId: '@ds/foo' },
      { type: 'system', version: '5.5.5', widgetId: '@ds/bar' },
    ]);

    const result = ifSystemPluginRequestedOnProd({
      route: '/foo',
      widgetId: '@ds/foo',
      enabled: true,
    });

    expect(result).toBe(false);
  });
});

describe('IndexController', () => {
  // it('should call res.cookie when automation framework is running', () => {
  //   const mockReq = {
  //     query: { automated_test_framework: 'active' },
  //     plugin: {},
  //   };
  //   const mockCookie = jest.fn();
  //   const mockRes = { cookie: mockCookie };
  //   const mockNext = jest.fn();

  //   IndexController.index(
  //     mockReq as unknown as Request,
  //     mockRes as unknown as Response,
  //     mockNext,
  //   );

  //   expect(mockCookie).toHaveBeenCalledWith(
  //     ACTIVE_AUTOMATED_TEST_FRAMEWORK,
  //     'active',
  //     { secure: true },
  //   );
  // });

  it('should return 404 when system plugin is requested on prod', () => {
    jest
      .spyOn(indexControllerModule, 'ifSystemPluginRequestedOnProd')
      .mockReturnValueOnce(true);
    const mockReq = {
      query: { automated_test_framework: 'active' },
      plugin: {},
    };
    const mockCookie = jest.fn();
    const mockSendStatus = jest.fn();
    const mockRes = { cookie: mockCookie, sendStatus: mockSendStatus };
    const mockNext = jest.fn();

    IndexController.index(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext,
    );

    expect(mockSendStatus).toHaveBeenCalledWith(404);
  });

  it('should set csp header if not a system plugin allowUnsafeEvalForSystemPluginsOnPreprod', () => {
    jest
      .spyOn(indexControllerModule, 'ifSystemPluginRequestedOnProd')
      .mockReturnValueOnce(false);

    jest
      .spyOn(indexControllerModule, 'allowUnsafeEvalForSystemPluginsOnPreprod')
      .mockReturnValueOnce(true);

    const mockReq = {
      query: { automated_test_framework: 'active' },
      plugin: {},
    };
    const mockCookie = jest.fn();
    const mockSet = jest.fn();
    const mockRes = { cookie: mockCookie, set: mockSet };
    const mockNext = jest.fn();

    IndexController.index(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext,
    );

    expect(mockSet).toHaveBeenCalledWith({
      'Content-Security-Policy': "connect-src * data: blob: 'unsafe-inline'",
    });
  });
});