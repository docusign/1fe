import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';

/*
TODO:
- strongly type request
- make nonce configurable
*/

const nonceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // calculate nonce
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
  } catch (error) {
    next(error);
  } finally {
    return next();
  }
};

export default nonceMiddleware;
