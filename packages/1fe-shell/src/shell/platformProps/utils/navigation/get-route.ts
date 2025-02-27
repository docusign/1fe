import { Route } from '../../../types/url';
import { getBaseHrefUrl } from '../../../utils/url';

import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

/**
 * Returns the route you are on relative to your current widget
 * e.g. on https://services.dev.docusign.net/1ds-app/v1.0/send/1234/abcd/asdf `getRoute` will return /1234/abcd/asdf
 * by default, query params are attached to the result unless you use the `excludeQueryParams` parameter
 */
export const getRoute =
  (widgetId: string) =>
  (excludeQueryParams = false): Route => {
    const baseHrefUrl = getBaseHrefUrl();
    const href = window.location.href;

    // need to calculate pathname based off baseHrefUrl and not just use url.pathname since we want to exclude all (if any) pathname segments that belong to the baseHref
    // i.e. need to cover edge cases where the baseHrefUrl could be https://apps.docusign.com/ or https://apps.docusign.com/1ds-app/v1.0/ (<- technically deprecated but should still cover this edge case)
    const pathnameUsingBaseHref = href.slice(
      href.indexOf(baseHrefUrl) + baseHrefUrl.length,
    );

    const url = new URL(`https://placeholder.com/${pathnameUsingBaseHref}`);
    const route = url.pathname
      .split('/')
      .filter((s) => Boolean(s))
      .slice(1)
      .join('/');

    logPlatformUtilUsage({
      utilNamespace: 'navigation',
      functionName: 'getRoute',
      widgetId,
      args: { excludeQueryParams },
      success: true,
    });

    if (excludeQueryParams) {
      return `/${route}`;
    }

    return `/${route}${url.search}`;
  };
