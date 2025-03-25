import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';
import { readOneFEConfigs } from '../utils/one-fe-configs';

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
      .replace(/addCspNonceGuidHere/g, `'nonce-${cspNonceGuid}'`);

    if (cspReportOnlyHeader) {
      const noncedCspReportOnlyHeader = cspReportOnlyHeader
        .toString()
        .replace(/addCspNonceGuidHere/g, `'nonce-${cspNonceGuid}'`);
      res.setHeader(
        'content-security-policy-report-only',
        noncedCspReportOnlyHeader,
      );
    }

    res.setHeader('content-security-policy', noncedCspHeader);
    req.cspNonceGuid = cspNonceGuid;

    return next();
  } catch (error) {
    next(error);
  }
};

export default nonceMiddleware;
