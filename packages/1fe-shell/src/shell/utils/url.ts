import { DYNAMIC_CONFIGS } from '../configs/config-helpers';
import { WidgetConfig } from '../types/widget-config';

type TemplatizeCDNUrlArgs = {
  widgetId: string;
  widgetVersion: string;
  templateFilePath?: string;
};

const templatizeCDNUrl = ({
  widgetId,
  widgetVersion,
  templateFilePath = 'js/1fe-bundle.js',
}: TemplatizeCDNUrlArgs): URL => {
  return new URL(
    `${DYNAMIC_CONFIGS.cdn.widgets.basePrefix}${widgetId}/${widgetVersion}/${templateFilePath}`,
  );
};

export const generateCDNUrl = (widget: WidgetConfig): URL => {
  return templatizeCDNUrl({
    widgetId: widget.widgetId,
    widgetVersion: widget.version,
  });
};

/**
 * get the value of href attribute defined in the base html element
 * @param doc for use with iframes
 * @returns value of href attribute defined in the base html element
 */
export const getBaseHrefUrl = (doc = document) => {
  const baseHref = doc
    ?.querySelector('base')
    ?.getAttribute('href') as `http${string}/`; // TODO: remove cast when 1fe/utils is dead

  if (!baseHref) {
    const error = 'missing href attribute on base html element';
    throw new Error(error);
  }

  // we are defining all base URLs to end with a slash so this is a safe type cast
  return baseHref;
};

/**
 * get the pathname of the base href URL
 * @returns the pathname of the base href URL, if there is no pathname (e.g. `https://google.com` or `https://google.com/`) it will return "/"
 */
export const basePathname = (): string => new URL(getBaseHrefUrl()).pathname;

/**
 * Reloads the page with the option to bust the service worker cache that affects document caching only
 * @param bustDocumentServiceWorkerCache - boolean to determine if the service worker cache should be busted
 */
export const reloadPage = (
  { bustDocumentServiceWorkerCache } = {
    bustDocumentServiceWorkerCache: false,
  },
): void => {
  // Reloads Page with sw_cb query param to cache burst
  const newUrl = new URL(window.location.href);

  // if (bustDocumentServiceWorkerCache) {
  //   // this must be removed when the Shell boots/inits after the reload
  //   newUrl.searchParams.set(SW_CB, 'true');
  // }

  window.location.href = newUrl.href;
};

type GetWidgetBaseCdnUrlArgs = {
  widgetId: string;
  version: string;
};

export const getWidgetBundleCdnUrl = ({
  widgetId,
  version,
}: GetWidgetBaseCdnUrlArgs): string => {
  const widgetBundlePath = '/js/1fe-bundle.js';
  const baseUrl = `${DYNAMIC_CONFIGS.cdn.widgets.basePrefix}/${widgetId}/${version}`;

  return `${baseUrl}${widgetBundlePath}`;
};

/**
 * Returns string with trailing slash removed.
 * Example: http://localhost.com/ => http://localhost.com
 * @returns Returns string with trailing slash removed.
 */
export const stripTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

/**
 * Given the plugin's route w/ params(optional), return full plugin url.
 * Currently used to href redirect to plugin.
 * @param pluginPathWithParams - plugin path w/ params. (e.g /send/home?forceReauth=1)
 * @returns Returns full plugin url. (e.g https://apps.dev.docusign.net/send/home?forceReauth=1)
 */
export const getPluginUrlWithRoute = (pluginPathWithParams: string) => {
  try {
    return new URL(
      pluginPathWithParams,
      stripTrailingSlash(getBaseHrefUrl()),
    ).toString();
  } catch (e: any) {
    throw new Error(`Something went wrong building plugin url: ${e.message}`);
  }
};

/**
 * Appends query params onto url path using URL class.
 * @param path - path (e.g /path/name)
 * @param queryParams - key value pairs of query params and values. (e.g { param1: paramValue })
 * @returns pathname + queryParams (/path/name?param1=paramValue)
 */
export const addQueryParamsToPath = (
  path: string,
  queryParams: Record<string, string>,
): string => {
  // dummy url. Just need to use URL class for guard rails
  const url = new URL(path, 'https://dummy.url.com');

  // Loop through object and append query params
  Object.entries(queryParams).forEach(([queryParam, paramValue]) => {
    url.searchParams.append(queryParam, paramValue);
  });

  // Return just pathname + search params
  return url.pathname + url.search;
};
