import { NextFunction, Request, Response } from 'express';

import { ROUTES, STATIC_ASSETS } from '../constants';
import { readOneFEConfigs } from '../utils/one-fe-configs';
import { matchesUA } from 'browserslist-useragent';
import { isEmpty } from 'lodash';

// TODO: [1FE consumption] Need to add option to ignore certain routes, or just reuse known routes
const ignoredRoutes = [
  ROUTES.WATCHDOG,
  ROUTES.HEALTH,
  ROUTES.VERSION,
  // ROUTES.API,
  // ROUTES.LOAD_TEST,
];

// TODO: [1FE consumption] When consuming back, need to add middleware for isAutomationRun flag to be set
const browsersListMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const browsersListConfig =
      readOneFEConfigs()?.dynamicConfigs?.platform?.browserslistConfig
        .unsupportedBrowserScreen;

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
      !userAgent.includes('1fe-automation') &&
      !ignoredRoutes.includes(path) &&
      // Ignore redirecting for static assets (Only applicable to local dev mode - Usually served by CDN)
      !path.startsWith(STATIC_ASSETS.IMAGES) &&
      !path.startsWith(STATIC_ASSETS.FAVICON) &&
      !isEmpty(browsersListConfig)
    ) {
      const matchesSupportedBrowser = matchesUA(userAgent, {
        browsers: browsersListConfig,
        ignoreMinor: true,
        ignorePatch: true,
      });

      if (!matchesSupportedBrowser) {
        throw new Error('Unsupported Browser');
      }
    }
  } catch (err) {
    next(err);
  }
  return next();
};

export default browsersListMiddleware;
