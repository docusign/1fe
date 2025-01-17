import { NextFunction, Request, Response } from 'express';
import { query } from 'express-validator';

import { RUNTIME_CONFIG_OVERRIDES, WIDGET_URL_OVERRIDES } from '../constants';

// TODO - Make these configurable via options: IS_PROD, IS_LOCAL_OR_INTEGRATION, ALLOWED_USER_AGENTS_FOR_WIDGET_OVERRIDE
const IS_LOCAL_OR_INTEGRATION = false;
const IS_PROD = true;

export const ALLOWED_USER_AGENTS_FOR_WIDGET_OVERRIDE = ['test.userAgent'];

const forbiddenQueryParams = [
  'imo', // Used by import-map-overrides library to allow users to request import map overrides
];

const redirectIfForbiddenQueryParams = (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] || '';

  // Check if widget_url_override query string exists
  const hasWidgetOverride = !!req.query[WIDGET_URL_OVERRIDES];

  // Does User-Agent include oone of the allowed substrings?
  const validUAForOverride = ALLOWED_USER_AGENTS_FOR_WIDGET_OVERRIDE.some(
    (allowedUA) => userAgent.includes(allowedUA),
  );

  // Check to see if redirect is needed for removing widget_url_overrides
  const widgetOverrideSanitizeRequired =
    hasWidgetOverride && !validUAForOverride && IS_PROD;

  const needsRedirect =
    forbiddenQueryParams.find((param) => param in req.query) ||
    widgetOverrideSanitizeRequired;

  if (needsRedirect) {
    // Remove the forbidden query parameters
    const sanitizedParams = Object.entries(req.query).reduce(
      (acc, [key, value]) => {
        if (!forbiddenQueryParams.includes(key)) {
          acc.append(key, value as string);
        }
        return acc;
      },
      new URLSearchParams(),
    );

    // If widget_url_override exists and ua substring doesnt exist, then remove widget_url_override
    if (
      sanitizedParams.get(WIDGET_URL_OVERRIDES) &&
      widgetOverrideSanitizeRequired
    ) {
      sanitizedParams.delete(WIDGET_URL_OVERRIDES);
    }

    res.redirect(307, req.path + '?' + sanitizedParams.toString());
  }
};

const validateRuntimeConfigOverrides = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!IS_LOCAL_OR_INTEGRATION) {
    delete req.query.runtime_config_overrides;
    return;
  }

  // TODO: figure out a pattern for escape/unescape. The express-validator library doesn't allow calling escape outside of a chain.
  const result = await query(RUNTIME_CONFIG_OVERRIDES)
    .isJSON()
    .optional()
    .run(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      message:
        'Invalid runtime_config_overrides query param. Must be a valid JSON object.',
      error: result.array(),
    });
  }
};

/**
 * Express middleware that detects when an unsafe query parameter is used
 * and if so Redirects to the same URL without the query parameters.
 */
const sanitizeQueryParamsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    redirectIfForbiddenQueryParams(req, res);

    await validateRuntimeConfigOverrides(req, res);
  } catch (err) {
    next(err);
  }

  return next();
};

export default sanitizeQueryParamsMiddleware;
