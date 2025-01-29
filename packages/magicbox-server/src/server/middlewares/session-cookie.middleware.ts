import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';

/*
TODO: 
 - [1DS consumption] When consuming back, need new middleware to force native auth via session id
 - [1DS consumption] When consuming back, need new middleware for updateOtelContextWithSessionId
 - Strongly type request
*/

const SESSION_ID = 'session_id';

export const sessionCookieMiddleware =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const cookieOptions = {
        secure: true,
        sameSite: 'none',
        partitioned: true,
      };

      if (!req.cookies[SESSION_ID]) {
        // This is temporary for SAW testing. Locked to integration only.
        const sessionId = randomUUID();

        res.cookie(SESSION_ID, sessionId, cookieOptions as any);
        // Express (https://www.npmjs.com/package/express) uses the cookie package (https://www.npmjs.com/package/cookie) under the hood to set cookies.
        // The partitioned attribute is only supported in cookie ^0.6.0, express currently uses cookie 0.5.0.
        // We override cookie to 0.6.0 in our package.json but a cast is still needed here until express updates their dependencies + types.);

        // Add sessionid to request object to be used in other middlewares if client doesnt send it
        (req as any).session_id = sessionId;
      }
    } catch (error) {
      next(error);
    }
    return next();
  };
