import { NextFunction, Request, Response } from 'express';

// TODO: Powered by configurable
const POWERED_BY = 'Docusign';

const securityMiddleware = (
  // @ts-ignore
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.setHeader('x-powered-by', POWERED_BY);
    res.setHeader('cache-control', 'no-store');
    res.setHeader(
      'strict-transport-security',
      'max-age=31536000; includeSubDomains;',
    );
  } catch (err) {
    next(err);
  }

  return next();
};

export default securityMiddleware;
