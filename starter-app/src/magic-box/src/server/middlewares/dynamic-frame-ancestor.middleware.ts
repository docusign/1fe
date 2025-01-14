import { NextFunction, Request, Response } from 'express';

import {
  isUrlValid,
  removeWildcardsFromCSPFrameAncestors,
  replaceFrameAncestorWildcards,
} from '../utils';

export const DEFAULT_REFERER = '';

/*
  TODO:
  - strongly type request
  - Consume removeWildcard config
  - Implement getRuntimeCSPConfigs
  - Read environment from configs
*/

const environment = 'production;'

// @ts-ignore
const getRuntimeCSPConfigs = ({ pluginId, reportOnly, req}: any) => {
  return {
    "imgSrc": [
    "https://lhWidget-csp-test.docusign.com",
    "https://lhWidget-csp-test-runtime.docusign.com"
    ],
    "frameAncestors": [
    "*"
    ]
    }
}

/**
 * Middleware to dynamically replace wildcard frameAncestors with referer if pattern matches
 */
const dynamicFrameAncestorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
    try {
      const { plugin, headers } = req as any;
      const refererHeader = headers.referer || '';

      // Grab csp for plugin
      const cspHeader: string = res.getHeader(
        'content-security-policy',
      ) as string;

      const cspReportOnlyHeader: string = res.getHeader(
        'content-security-policy-report-only',
      ) as string;

      // Plugin needs to be enabled
      if (plugin?.enabled && isUrlValid(refererHeader, environment)) {
        if (!cspHeader) {
          const message = 'missing CSP in dynamicFrameAncestorMiddleware';
          const error = new Error(message);

          throw error;
        }
        // Grab referer origin if url is valid
        const refererUrl = new URL(refererHeader)?.origin;

        // Get plugin's frameAncestors from csp configuration
        const pluginFrameAncestors = getRuntimeCSPConfigs({
          pluginId: plugin.widgetId,
          reportOnly: false,
          req,
        })?.frameAncestors;

        const pluginFrameAncestorsReportOnly = getRuntimeCSPConfigs({
          pluginId: plugin.widgetId,
          reportOnly: true,
          req,
        })?.frameAncestors;

        // query string param turning on frame ancestors removal
        const enableEmbedded = req.query?.enableEmbedded as string;

        // Replace any matched wildcards with referer, remove other wildcards
        const newEnforcedCsp = replaceFrameAncestorWildcards(
          refererUrl,
          cspHeader,
          pluginFrameAncestors,
          plugin.widgetId,
          enableEmbedded,
        );
        res.setHeader('content-security-policy', newEnforcedCsp);

        if (cspReportOnlyHeader) {
          const newReportOnlyCsp = replaceFrameAncestorWildcards(
            refererUrl,
            cspReportOnlyHeader,
            pluginFrameAncestorsReportOnly,
            plugin.widgetId,
            enableEmbedded,
          );
          res.setHeader(
            'content-security-policy-report-only',
            newReportOnlyCsp,
          );
        }
      } else {
        // else remove wildcards from frameAncestors
        res.setHeader(
          'content-security-policy',
          removeWildcardsFromCSPFrameAncestors(cspHeader),
        );

        if (cspReportOnlyHeader) {
          res.setHeader(
            'content-security-policy-report-only',
            removeWildcardsFromCSPFrameAncestors(cspReportOnlyHeader),
          );
        }
      }
    } catch (err) {
      next(err);
    }

    return next();
};

export default dynamicFrameAncestorMiddleware;
