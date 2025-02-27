
// import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

import { Route } from "../../../types/url";
import { getBaseHrefUrl } from "../../../utils/url";

/**
 * Return the current plugin's root route. e.g. on `https://apps.docusign.com/send/documents` it will return `/send`
 */
export const getPluginRoute = (): Route => {
  const href = window.location.href;

  const baseHrefUrl = getBaseHrefUrl();

  // need to calculate pathname based off baseHrefUrl and not just use url.pathname since we want to exclude all (if any) pathname segments that belong to the baseHref
  // i.e. need to cover edge cases where the baseHrefUrl could be https://apps.docusign.com/ or https://apps.docusign.com/1ds-app/v1.0/ (<- technically deprecated but should still cover this edge case)
  const pathnameUsingBaseHref = href.slice(
    href.indexOf(baseHrefUrl) + baseHrefUrl.length,
  );

  const url = new URL(`https://placeholder.com/${pathnameUsingBaseHref}`);

  if (url.pathname === '/') {
    return '/';
  }

  const rootRoute = url.pathname.split('/').filter((s) => Boolean(s))[0];
  return `/${rootRoute}`;
};

// export const getPluginRouteWithTelemetry = (widgetId: string) => () => {
  // logPlatformUtilUsage({
  //   utilNamespace: 'navigation',
  //   functionName: 'getPluginRoute',
  //   widgetId,
  // });

//   return getPluginRoute();
// };
