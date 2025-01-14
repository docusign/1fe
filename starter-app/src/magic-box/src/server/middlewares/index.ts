import browsersListMiddleware from './browserslist.middleware';
import dynamicCspMiddleware from './dynamic-csp-header.middleware';
import dynamicFrameAncestor from './dynamic-frame-ancestor.middleware';
import nonceMiddleware from './nonce.middleware';
import pluginMiddleware from './plugin.middleware';
import sanitizeQueryParamMiddleware from './sanitize-query-params.middleware';
import securityMiddleware from './security.middleware';
import { sessionCookieMiddleware } from './session-cookie.middleware';

const combinedMiddleware = [
  sessionCookieMiddleware(),
  sanitizeQueryParamMiddleware,
  browsersListMiddleware,
  pluginMiddleware,
  dynamicCspMiddleware,
  dynamicFrameAncestor,
  nonceMiddleware,
  securityMiddleware,
];

export default combinedMiddleware;
