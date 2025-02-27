import { Request, Response, NextFunction } from 'express';
import httpMocks from 'node-mocks-http';
import dynamicCspHeaderMiddleware, * as cspHelpers from '../dynamic-csp-header.middleware'; // Replace with the actual path to your middleware function

jest.mock('../../utils/magicbox-configs', () => ({
  readMagicBoxConfigs: jest.fn().mockImplementation(() => ({ environment: 'development' })),
}));
describe('dynamicCspHeaderMiddleware', () => {
  const mockRequest: any = httpMocks.createRequest();
  const mockResponse: any = httpMocks.createResponse();
  let next: NextFunction;
  let mockGenerateCSPPolicy: jest.Mock;

  beforeEach(() => {
    mockRequest.plugin = { widgetId: '@1ds/widget-starter-kit' };
    next = jest.fn();
    mockGenerateCSPPolicy = jest.fn().mockImplementation(() => {});

    jest
      .spyOn(cspHelpers, 'generateCSPPolicy')
      .mockImplementation(mockGenerateCSPPolicy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set CSP middleware correctly', async () => {
    await dynamicCspHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    expect(mockGenerateCSPPolicy).toHaveBeenCalledWith({
      environment: 'development',
      pluginId: '@1ds/widget-starter-kit',
      req: mockRequest,
    });

    // helmet middleware should call next
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with error when generateCSPPolicy throws', async () => {
    const error = new Error('generateCSPPolicy error');
    mockGenerateCSPPolicy.mockImplementation(() => {
      throw error;
    });

    await dynamicCspHeaderMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      next,
    );

    // should go to error middleware
    expect(next).toHaveBeenCalledWith(error);
  });
});
