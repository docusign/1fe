import { DYNAMIC_CONFIGS } from '../configs/config-helpers';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';

const templatizeCDNUrl = ({
  widgetId,
  widgetVersion,
  templateFilePath = 'js/1ds-bundle.js',
}: any): URL => {
  return new URL(
    `${DYNAMIC_CONFIGS.cdn.widgets.basePrefix}${widgetId}/${widgetVersion}/${templateFilePath}`,
  );
};

export const generateCDNUrl = (widget: any): URL => {
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
    ?.getAttribute('href') as `http${string}/`; // TODO: remove cast when 1ds/utils is dead

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
  const widgetBundlePath = '/js/1ds-bundle.js';
  const baseUrl = `${readMagicBoxShellConfigs().cdn.widgets.basePrefix}/${widgetId}/${version}`;

  return `${baseUrl}${widgetBundlePath}`;
};
