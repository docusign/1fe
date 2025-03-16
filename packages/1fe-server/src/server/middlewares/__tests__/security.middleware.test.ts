import { NextFunction } from 'express';
import httpMocks from 'node-mocks-http';

import securityMiddleware from '../security.middleware';

jest.mock('../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest
    .fn()
    .mockImplementation(() => ({ orgName: 'TestOrg' })),
}));

describe('security.middleware tests', () => {
  let mockRequest: any = httpMocks.createRequest();
  let mockResponse: any;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = httpMocks.createResponse();
  });

  test('response headers must contain security headers', async () => {
    await securityMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.getHeader('x-powered-by')).toEqual('TestOrg');
    expect(mockResponse.getHeader('cache-control')).toEqual('no-store');
    expect(mockResponse.getHeader('strict-transport-security')).toEqual(
      'max-age=31536000; includeSubDomains;',
    );
  });
});
