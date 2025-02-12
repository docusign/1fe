import { NextFunction, Request, Response } from 'express';
import { readMagicBoxConfigs } from '../utils/magicbox-configs';

const securityMiddleware = (
  // @ts-ignore
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.setHeader(
      'x-powered-by',
      readMagicBoxConfigs().orgName,
    );
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
