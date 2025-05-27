import { Response } from 'express';
import httpMocks from 'node-mocks-http';

import sanitizeQueryParamsMiddleware, {
  ALLOWED_USER_AGENTS_FOR_WIDGET_OVERRIDE,
} from '../sanitize-query-params.middleware';
import * as Configs from '../../configs';
import { WIDGET_URL_OVERRIDES } from '../../constants';
import { readOneFEConfigs } from '../../utils/one-fe-configs';
import { OneFEProcessedConfigs } from '../../types/one-fe-server';

jest.mock('../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest
    .fn()
    .mockImplementation(() => ({ isProduction: true })),
}));

describe('sanitizeQueryParamsMiddleware', () => {
  let res: Response = httpMocks.createResponse();
  let next: jest.Mock;

  beforeEach(() => {
    // https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests
    // @ts-expect-error this is necessary to mock primitive values and change them in the same file
    Configs.IS_LOCAL_OR_INTEGRATION = true;
    next = jest.fn();
    res = httpMocks.createResponse();
  });

  it('should call next if no forbidden query parameters are present', async () => {
    const req = httpMocks.createRequest({
      url: '/test?foo=bar',
    });

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should redirect to the same URL without forbidden query parameters', async () => {
    jest.spyOn(res, 'redirect');

    const url = '/test?foo=bar&imo=forbidden';
    const req = httpMocks.createRequest({
      url,
      query: {
        foo: 'bar',
        imo: 'forbidden',
      },
    });

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      307,
      url.replace(/(\?|&)imo=forbidden/, ''),
    );
  });

  it('should return an error if runtime_config_overrides is not a valid JSON object', async () => {
    jest
      .mocked(readOneFEConfigs)
      .mockImplementationOnce(
        () => ({ isProduction: false }) as OneFEProcessedConfigs,
      );
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'send');
    const url = '/test?runtime_config_overrides={invalid: "json"}';
    const req = httpMocks.createRequest({
      url,
      query: {
        runtime_config_overrides: 123,
      },
    });

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message:
        'Invalid runtime_config_overrides query param. Must be a valid JSON object.',
      error: expect.any(Array),
    });
  });

  it('should call next if runtime_config_overrides is a valid JSON object', async () => {
    const req = httpMocks.createRequest({
      url: '/test?runtime_config_overrides={"valid": "json"}',
      query: {
        runtime_config_overrides: '{"valid": "json"}',
      },
    });

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should delete runtime_config_overrides if not in local or integration environment', async () => {
    const req = httpMocks.createRequest({
      url: '/test?runtime_config_overrides={"valid": "json"}',
      query: {
        runtime_config_overrides: '{"valid": "json"}',
      },
    });

    // https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests
    // @ts-expect-error this is necessary to mock primitive values and change them in the same file
    Configs.IS_LOCAL_OR_INTEGRATION = false;

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(req.query.runtime_config_overrides).toBeUndefined();
  });

  it('should delete widget_url_override QS if allowed user-agent doesnt exist', async () => {
    jest.spyOn(res, 'redirect');

    const url = '/test?qs1=test&widget_url_overrides={"test": "testtest"}';
    const req = httpMocks.createRequest({
      url,
      query: {
        widget_url_overrides: '{"test": "testtest"}',
        qs1: 'test',
      },
      headers: {
        'User-Agent': 'No allowed substring',
      },
    });

    await sanitizeQueryParamsMiddleware(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(307, '/test?qs1=test');
  });

  it.each(ALLOWED_USER_AGENTS_FOR_WIDGET_OVERRIDE)(
    'should persist widget_url_override QS if allowed user-agent exists',
    async (allowedUa) => {
      jest.spyOn(res, 'redirect');

      const url = '/test?qs1=test&widget_url_overrides={"test": "testtest"}';
      const req = httpMocks.createRequest({
        url,
        query: {
          widget_url_overrides: '{"test": "testtest"}',
          qs1: 'test',
        },
        headers: {
          'User-Agent': allowedUa,
        },
      });

      await sanitizeQueryParamsMiddleware(req, res, next);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.query[WIDGET_URL_OVERRIDES]).toBe('{"test": "testtest"}');
    },
  );
});
