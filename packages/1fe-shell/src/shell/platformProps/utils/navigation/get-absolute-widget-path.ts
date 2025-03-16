import { getBaseHrefUrl } from '../../../utils/url';

/**
 * 1FE URL path util that will get you absolute path to the current widget root. e.g. `https://services.dev.docusign.net/1fe-app/v1.0/send/1234/abcd/asdf` will return `https://services.dev.docusign.net/1fe-app/v1.0/send`
 * @param getFullPath if true, the function will return the full absolute path e.g. `https://services.dev.docusign.net/1fe-app/v1.0/send/1234/abcd/asdf` will return `https://services.dev.docusign.net/1fe-app/v1.0/send/1234/abcd/asdf`
 * @returns path
 */
export const getAbsoluteWidgetPath = (getFullPath?: boolean): string => {
  const baseHrefUrl = getBaseHrefUrl();
  const href = window.location.href;

  if (getFullPath) {
    return href;
  }

  const rootWidgetRoute = href
    .slice(href.indexOf(baseHrefUrl) + baseHrefUrl.length)
    .split('/')
    .filter((s) => Boolean(s))[0]; // e.g. send or radmin (no leading slash)

  return `${baseHrefUrl}${rootWidgetRoute}`;
};
