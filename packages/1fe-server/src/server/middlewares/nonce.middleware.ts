import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';
import { readOneFEConfigs } from '../utils/one-fe-configs';
import { injectNonceIntoCSP } from '../utils';

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

    // Check if we should inject nonce. Default to false;
    const injectNonce = readOneFEConfigs()?.csp?.injectNonce || false;

    const stringifiedCSPHeader = cspHeader.toString();

    // Inject nonce into enforced CSP if configured
    const noncedCspHeader = injectNonce
      ? injectNonceIntoCSP(stringifiedCSPHeader, `'nonce-${cspNonceGuid}'`)
      : stringifiedCSPHeader;

    // Inject nonce into report only CSP if configured and report only CSP exists
    if (cspReportOnlyHeader) {
      const stringifiedReportOnlyCSPHeader = cspReportOnlyHeader.toString();

      const noncedCspReportOnlyHeader = injectNonce
        ? injectNonceIntoCSP(
            stringifiedReportOnlyCSPHeader,
            `'nonce-${cspNonceGuid}'`,
          )
        : stringifiedReportOnlyCSPHeader;
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
