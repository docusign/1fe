import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';
import { readMagicBoxConfigs } from '../utils/magicbox-configs';

/*
TODO: strongly type request
*/

const nonceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // calculate nonce
    if (readMagicBoxConfigs().dynamicConfigs?.csp?.useNonce) {
      const cspNonceGuid = `${randomUUID()}`;

      const cspHeader = res.getHeader('content-security-policy');
      const cspReportOnlyHeader = res.getHeader(
        'content-security-policy-report-only',
      );

      if (!cspHeader) {
        const error = new Error('missing CSP in nonceMiddleware');

        throw error;
      }

      const noncedCspHeader = cspHeader
        .toString()
        .replace('addCspNonceGuidHere', `'nonce-${cspNonceGuid}'`);

      if (cspReportOnlyHeader) {
        const noncedCspReportOnlyHeader = cspReportOnlyHeader
          .toString()
          .replace('addCspNonceGuidHere', `'nonce-${cspNonceGuid}'`);
        res.setHeader(
          'content-security-policy-report-only',
          noncedCspReportOnlyHeader,
        );
      }

      res.setHeader('content-security-policy', noncedCspHeader);
      (req as any).cspNonceGuid = cspNonceGuid;
    }
  } catch (error) {
    next(error);
  } finally {
    return next();
  }
};

export default nonceMiddleware;
