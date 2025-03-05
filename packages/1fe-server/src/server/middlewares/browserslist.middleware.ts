import { NextFunction, Request, Response } from 'express';

import { ROUTES, STATIC_ASSETS, ERROR_MIDDLEWARE_TYPES } from '../constants';
const { matchesUA } = require('browserslist-useragent');

// REVISIT: CONSUME CONFIG HERE
const BROWSERS_LIST: string[] = [];
const ignoredRoutes = [
  ROUTES.WATCHDOG,
  ROUTES.HEALTH,
  ROUTES.VERSION,
  ROUTES.API,
  ROUTES.LOAD_TEST,
];
// STATIC ASSETS

// TODO: [1DS consumption] When consuming back, need to add middleware for isAutomationRun flag to be set

const browsersListConfig = BROWSERS_LIST;

const browsersListMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { path } = req || {};
    const activeAutomatedTestFramework =
      req.query.automated_test_framework || null;
    const userAgent = req?.headers?.['user-agent'];

    if (
      // not an automation test (SAW or Playwright) by query param
      !activeAutomatedTestFramework &&
      // is Useragent header present
      userAgent &&
      // UserAgent does not have SAW or Playwright signature
      !userAgent.includes('ClientTransactionId') && // exclude SAW and/or Playwright automated tests
      !userAgent.includes('sawmill.docusignhq') && // exclude SAW and/or Playwright automated tests
      !ignoredRoutes.includes(path) &&
      // Ignore redirecting for static assets (Only applicable to local dev mode - Usually served by CDN)
      !path.startsWith(STATIC_ASSETS.IMAGES) &&
      !path.startsWith(STATIC_ASSETS.FAVICON)
    ) {
      const matchesUnsupportedBrowser = matchesUA(userAgent, {
        browsers: browsersListConfig,
      });

      if (matchesUnsupportedBrowser) {
        throw new Error('Unsupported Browser');
      }
    }
  } catch (err) {
    next(err);
  }
  return next();
};

export default browsersListMiddleware;
