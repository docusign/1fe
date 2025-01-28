import { Request } from 'express';
import { RUNTIME_CONFIG_OVERRIDES } from "../constants";
import { RuntimeConfig } from "../types";
import { readMagicBoxConfigs } from "./config-poller";
import { getParamFromQueryOrRedirectUri } from "./url";
import { getCachedWidgetConfigs } from "./widget-config";

const getFrameAncestorAllowlist = (enableEmbedded: string | undefined) => {
  // param downscopes functionality for send
  return enableEmbedded === '1'
    ? ['@ds/send', '@ace/template-assistant']
    : ['@ace/template-assistant'];
};

/**
 * Update CSP header with new frame ancestor value
 * @param cspHeader The whole csp header
 * @param newFrameAncestor The new frame ancestor value
 * @returns Returns updated csp header with new frame ancestor
 */
const replaceFrameAncestorsInCSP = (
  cspHeader: string,
  newFrameAncestor: string,
): string => {
  const directives = cspHeader.split(';');

  for (let i = 0; i < directives.length; i++) {
    const directive = directives[i].trim();
    if (directive.startsWith('frame-ancestors')) {
      directives[i] = `frame-ancestors ${newFrameAncestor}`;
      break;
    }
  }

  return directives.join('; ');
};

/**
 * Update CSP header with new frame ancestor value
 * @param cspHeader The whole csp header
 * @param newFrameAncestor The new frame ancestor value
 * @returns Returns updated csp header with new frame ancestor
 */
const removeFrameAncestorsFromWildcardCSP = (cspHeader: string): string => {
  const directives = cspHeader.split(';');

  for (let i = 0; i < directives.length; i++) {
    const directive = directives[i].trim();
    if (directive.startsWith('frame-ancestors')) {
      directives.splice(i, 1);
      break;
    }
  }

  return directives.join('; ');
};

/**
 * Grabs frame ancestor value from CSP header
 * @param cspHeader The whole csp header
 * @returns Frame ancestor value or null if frame-ancestor not found
 */
const getFrameAncestorFromCSP = (cspHeader: string): string | null => {
  const directives = cspHeader.split(';');

  // find frameAncestors from all directives
  for (const directive of directives) {
    const [key, value] = directive.trim().split(/\s+(.+)/);
    if (key === 'frame-ancestors') {
      return value?.trim() || '';
    }
  }

  // no frame-ancestors found
  return null;
};

const wildcardMatch = (pattern: string, input: string): boolean => {
  const patternSegments = pattern.split('*');
  // If there is no wildcard, perform a direct string comparison
  if (patternSegments.length === 1) {
    return pattern === input;
  }

  // Check if the input starts with the first segment of the pattern
  if (!input.startsWith(patternSegments[0])) {
    return false;
  }

  // Check if the input ends with the last segment of the pattern
  if (!input.endsWith(patternSegments[patternSegments.length - 1])) {
    return false;
  }

  // Check the positions of the wildcard segments
  for (let i = 1; i < patternSegments.length - 1; i++) {
    const wildcardIndex = input.indexOf(patternSegments[i]);
    if (
      wildcardIndex === -1 ||
      wildcardIndex < input.indexOf(patternSegments[i - 1])
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Replaces wildcard patterns with referer if pattern-matched, else wildcard is removed
 * @param frameAncestor Array of frame-ancestor values
 * @param referer Referer url from request object
 * @returns New frame-ancestor values with referer-replaced wildcards
 */
const replaceFrameAncestorWithReferer = (
  frameAncestor: string[],
  referer: string,
): string => {
  return frameAncestor
    .map((ancestorValue) => {
      if (ancestorValue.includes('*')) {
        // If has wildcard and matches referer, then return referer, else empty string
        return wildcardMatch(ancestorValue, referer) ? referer : '';
      } else {
        // If no wildcard, return original frame-ancestor value
        return ancestorValue;
      }
    })
    .join(' ');
};

/**
 * Removes all wildcards from frame-ancestor directive in CSP header
 * @param cspHeader CSP header from response object
 * @returns New CSP header with wildcard-less frame-ancestors
 */
export const removeWildcardsFromCSPFrameAncestors = (cspHeader: string) => {
  // get frameAncestor directive from csp
  const frameAncestorValue = getFrameAncestorFromCSP(cspHeader);

  // return original header if no frame-ancestor found
  if (frameAncestorValue === null) {
    return cspHeader;
  }

  // Remove wildcards from frame ancestor
  const noWildcardFrameAncestors = replaceFrameAncestorWithReferer(
    frameAncestorValue.split(' '),
    '',
  );
  return replaceFrameAncestorsInCSP(cspHeader, noWildcardFrameAncestors);
};

export const replaceFrameAncestorWildcards = (
  refererUrl: string,
  cspHeader: string,
  frameAncestors: string[] | undefined,
  widgetId: string,
  enableEmbedded: string | undefined,
) => {
  if (
    // restrict to plugins allowlisted for this
    getFrameAncestorAllowlist(enableEmbedded).includes(widgetId)
  ) {
    return removeFrameAncestorsFromWildcardCSP(cspHeader);
  }
  if (refererUrl && frameAncestors) {
    // Pattern match referer to wildcards in frame-ancestor
    const newFrameAncestor = replaceFrameAncestorWithReferer(
      frameAncestors,
      refererUrl,
    );

    // Replace old frame-ancestor with the new one
    return replaceFrameAncestorsInCSP(cspHeader, newFrameAncestor);
  }

  // if referer or frame ancestors are missing, then remove all wildcards from CSP
  return removeWildcardsFromCSPFrameAncestors(cspHeader);
};

export const isUrlValid = (url: string, environment: string) => {
  try {
    const urlForValidation = new URL(url);

    // allow http and https for local dev alone
    if (
      environment !== 'production' &&
      ['localhost', '[::1]', '127.0.0.1'].includes(urlForValidation.hostname)
    ) {
      return ['http:', 'https:'].includes(urlForValidation?.protocol);
    }

    // if not local dev check if the url has an SSL protocol
    return urlForValidation?.protocol === 'https:';
  } catch (ex) {
    return false;
  }
};

/**
 * Get runtime csp configurations. (defined in .1ds.config.ts)
 *
 * @param pluginId plugin's widgetId
 * @param reportOnly is the csp report-only or enforced
 * @param req request object to pull runtime_config_overrides query string
 * @returns Plugin's runtime csp configurations
 */
export const getRuntimeCSPConfigs = ({
  pluginId,
  reportOnly,
  req,
}: {
  pluginId: string;
  reportOnly: boolean;
  req: Request;
}) => {
  // Only want to override in local or integration. Not in higher environments.
  if (readMagicBoxConfigs().mode === 'preproduction') {
    // get stringified runtime configs
    const runtimeConfigOverridesParam = getParamFromQueryOrRedirectUri(
      req,
      RUNTIME_CONFIG_OVERRIDES,
    );

    // parse runtime config override if exist
    if (runtimeConfigOverridesParam) {
      const parsedRuntimeConfigs = JSON.parse(
        runtimeConfigOverridesParam,
      ) as Record<string, RuntimeConfig>;
      return reportOnly
        ? parsedRuntimeConfigs[pluginId]?.headers?.csp?.reportOnly
        : parsedRuntimeConfigs[pluginId]?.headers?.csp?.enforced;
    }
  }
  const pluginConfig = getCachedWidgetConfigs().get(pluginId);
  return reportOnly
    ? pluginConfig?.runtime?.headers?.csp?.reportOnly
    : pluginConfig?.runtime?.headers?.csp?.enforced;
};
