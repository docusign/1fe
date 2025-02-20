import { Request, Response } from 'express';
import HealthController from '../health.controller';

describe('HealthController', () => {
  it('should call next when error is throw', () => {
    const mockNext = jest.fn();
    const error = new Error('test error');
    const mockRes = {
      setHeader: jest.fn(() => {
        throw error;
      }),
    };
    const mockReq = {};

    HealthController.health()(
      mockReq as unknown as Request,
      mockRes as unknown as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
