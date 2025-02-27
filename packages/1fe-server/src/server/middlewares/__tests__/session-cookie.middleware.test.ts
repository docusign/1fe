import { randomUUID } from 'crypto';

import { Request, Response, NextFunction } from 'express';

import { SESSION_ID, sessionCookieMiddleware } from '../session-cookie.middleware';

describe('sessionCookieMiddleware', () => {
  let req: Request, res: Response, next: NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    req = {
      cookies: {},
      query: {},
      plugin: { widgetId: '@ds/test' },
    } as unknown as Request;

    res = {
      cookie: jest.fn(),
    } as unknown as Response;

    next = jest.fn() as NextFunction;
  });

  it('sets the @1ds_session_id cookie if not present', () => {
    sessionCookieMiddleware()(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(SESSION_ID, expect.any(String), {
      secure: true,
      sameSite: 'none',
      partitioned: true,
    });

    // should also attach to the request object if the client did not send it
    expect((req as any).session_id).toEqual(expect.any(String));

    expect(next).toHaveBeenCalled();
  });

  it('does not set a new @1ds_session_id cookie if one is already present', () => {
    req.cookies[SESSION_ID] = randomUUID();
    sessionCookieMiddleware()(req, res, next);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('passes the error to next function if there is an exception', () => {
    const mockError = new Error('test error');
    jest.mocked(res.cookie).mockImplementationOnce(() => {
      throw mockError;
    });

    sessionCookieMiddleware()(req, res, next);
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
