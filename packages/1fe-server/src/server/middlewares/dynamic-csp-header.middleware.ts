import { NextFunction, Request, Response } from 'express';
import { mergeWith, mapKeys, isArray, uniq } from 'lodash';

import helmet from 'helmet';
import { ROUTES } from '../constants';
import { getRuntimeCSPConfigs } from '../utils';
import { readMagicBoxConfigs } from '../utils/magicbox-configs';

type MergeCSPOptions = {
  environment?: string | undefined;
  reportOnly?: boolean;
  pluginId?: string;
  req: Request;
};

type GenerateCSPOptions = {
  // will grab CSP for this environment
  environment: string | undefined;

  // Grab report only CSP
  reportOnly?: boolean;

  // grab CSP for this plugin
  pluginId?: string;

  req: Request;
};

const kebabToCamel = (kebabCaseString: string): string => {
  return kebabCaseString.replace(/-([a-z])/g, (_, letter) => {
    return letter.toUpperCase();
  });
};

export const mergeWithUsingUniqueArray = (
  objValue: string[],
  srcValue: string[],
): string[] | undefined => {
  if (isArray(objValue)) {
    return uniq(objValue.concat(srcValue));
  }
  return undefined;
};

export const getMergedDirectives = (cspOptions: MergeCSPOptions) => {
  const { reportOnly = false, pluginId, req } = cspOptions;

  const reportEndpoint = reportOnly
    ? ROUTES.CSP_REPORT_ONLY
    : ROUTES.CSP_REPORT_VIOLATION;

  const mappedDefaultCSPDirectives = reportOnly
    ? readMagicBoxConfigs().csp?.defaultCSP?.reportOnly
    : readMagicBoxConfigs().csp?.defaultCSP?.enforced;

  const defaultDirectives = mapKeys(
    helmet.contentSecurityPolicy.getDefaultDirectives(),
    (_, key) => kebabToCamel(key),
  );
  const combinedDefaultDirectives = {
    ...defaultDirectives,
    ...(mappedDefaultCSPDirectives ?? {}),
  };

  // If pluginId is defined, grab only plugin's csp
  if (pluginId) {
    const cspConfigs =
      getRuntimeCSPConfigs({ pluginId, reportOnly, req: req }) || {};

    return {
      ...mergeWith(
        {},
        combinedDefaultDirectives,
        cspConfigs,
        mergeWithUsingUniqueArray,
      ),
      reportUri: [reportEndpoint],
    };
  } else {
    // If pluginId not provided, return default csp only
    return {
      ...combinedDefaultDirectives,
      reportUri: [reportEndpoint],
    };
  }
};

export const generateCSPPolicy = (generateOptions: GenerateCSPOptions) => {
  const {
    environment = 'development',
    reportOnly = false,
    pluginId,
    req,
  } = generateOptions;

  // Merge default CSP with plugin CSP. Tack on report-uri
  const mergedDirectives = getMergedDirectives({
    environment,
    reportOnly,
    pluginId,
    req,
  });

  return {
    useDefaults: true,
    directives: mergedDirectives,
    ...(reportOnly ? { reportOnly: true } : {}),
  };
};

/**
 * Middleware to generate CSP for a given plugin
 */
const dynamicCspHeaderMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pluginId = req.plugin?.widgetId;

    // Generate plugin csp with helmet
    const helmetCspMiddleware = helmet.contentSecurityPolicy(
      generateCSPPolicy({
        environment: readMagicBoxConfigs().environment,
        pluginId,
        req,
      }),
    );

    if (
      pluginId &&
      !!getRuntimeCSPConfigs({ pluginId, reportOnly: true, req })
    ) {
      // Generate plugin report only csp with helmet
      const helmetReportOnlyCspMiddleware = helmet.contentSecurityPolicy(
        generateCSPPolicy({
          environment: readMagicBoxConfigs().environment,
          pluginId,
          reportOnly: true,
          req,
        }),
      );

      helmetCspMiddleware(req, res, () =>
        helmetReportOnlyCspMiddleware(req, res, next),
      );
    } else {
      helmetCspMiddleware(req, res, next);
    }
  } catch (err) {
    next(err);
  }
};

export default dynamicCspHeaderMiddleware;
