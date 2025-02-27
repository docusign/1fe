import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

/**
 * This function embeds a hidden iframe in the web page this function is invoked on
 * This allows web apps to preload assets via an html page
 * Often used in conjunction with the npm library: @1ds/webpack-asset-preloader-plugin
 */
export const preloadUrl =
  (widgetId: string) =>
  (url: URL, delayInMs = 0): void => {
    logPlatformUtilUsage({
      utilNamespace: 'navigation',
      functionName: 'preloadUrl',
      widgetId,
      args: {
        arguments: { url, delayInMs },
      },
    });

    if (url && typeof window !== 'undefined') {
      // get url string from URL Type
      const urlAsAString = url.toString();

      // check if iframe is already embedded
      const iframeAlreadyPreloaded = document?.querySelector(
        `iframe[src="${urlAsAString}"]`,
      );

      // only inject if not embedded on this page
      if (!iframeAlreadyPreloaded) {
        setTimeout(() => {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = urlAsAString;
          iframe.onerror = () => {
            return true;
          };
          if (iframe.contentWindow) {
            iframe.contentWindow.onerror = () => {
              return true;
            };
          }

          document.body.appendChild(iframe);
        }, delayInMs);
      }
    } else {
      console.warn(
        '[UTILS_API] preloadUrl: Incorrect usage of API, please refer to API documentaiton.',
      );
    }
  };
