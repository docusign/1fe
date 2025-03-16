import {
  type NavigateFunction,
  type NavigateOptions as ReactRouterNavigateOptions,
} from 'react-router-dom';

import { type EventBusPlatformUtils } from '../event-bus/types';
import { getPluginRoute } from './get-plugin-route';
import { externalRedirect } from './external-redirect';
import {
  type SupportedOneDsNavOptions,
  isSupportedOneDsNavOption,
} from './navigation-options';
import { RUNTIME_CONFIG_OVERRIDES } from '../../../constants/search-params';
import {
  addQueryParamsToPath,
  getPluginUrlWithRoute,
} from '../../../utils/url';
import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

const PERSIST_QUERY_PARAMS_WHITELIST = [RUNTIME_CONFIG_OVERRIDES];

type NavigationEvents = {
  navigating: null;
};

type Navigate1feArgs = {
  navigateShell: NavigateFunction | undefined; // only undefined if used outside platform.props
  navigateWidget: NavigateFunction;
  eventBus: EventBusPlatformUtils;
  widgetId: string;
  externalRedirect: ReturnType<typeof externalRedirect>;
};

/**
 * Check if any whitelisted params exist on the url. If they do, then we should persist them.
 * Append them to the route. Currently, only used for runtime configuration overrides.
 */
const getRouteWithParams = (route: string): string => {
  // Get current query params
  const urlParams = new URL(window.location.href).searchParams;

  // Build key-value object of whitelisted query params that exist on urlParam
  const whitelistedUrlParams = PERSIST_QUERY_PARAMS_WHITELIST.reduce(
    (acc: Record<string, string>, param) => {
      // Check to see if current query params include whitelist params
      const paramValue = urlParams.get(param);

      // If true, store param value in accumalator
      if (paramValue) {
        acc[param] = paramValue;
      }
      return acc;
    },
    {},
  );

  // return path + query params
  return addQueryParamsToPath(route, whitelistedUrlParams);
};

/**
 * Creates target href for any navigation
 * @param to - Final destination
 * @param options - Navigation options
 * @returns Url that can be navigated to or added as anchor href
 */
export const getTargetHref = (
  to: string,
  options?: ReactRouterNavigateOptions | SupportedOneDsNavOptions,
): string => {
  const pluginToPluginNavigation =
    isSupportedOneDsNavOption(options) && options?.pluginToPluginNavigation;

  return pluginToPluginNavigation
    ? getPluginUrlWithRoute(getRouteWithParams(to))
    : getPluginRoute() + (to === '/' ? '' : to);
};

const widgetsRequiringRouterSyncOnNav = [
  '@ds/send', // Uses ui-router
];

export const navigate1FE = ({
  navigateShell,
  navigateWidget,
  widgetId,
  eventBus,
  externalRedirect,
}: Navigate1feArgs) =>
  (() => {
    function _publishNavigation(): void {
      widgetsRequiringRouterSyncOnNav.forEach((targetWidgetId) =>
        eventBus.publish<NavigationEvents, 'navigating'>({
          targetWidgetId,
          eventName: 'navigating',
          data: null,
        }),
      );
    }

    return function _navigate1FE(
      to: string,
      options?: ReactRouterNavigateOptions | SupportedOneDsNavOptions,
    ): void {
      if (!navigateShell) {
        throw new TypeError(`navigateShell is not defined: ${navigateShell}`);
      }

      logPlatformUtilUsage({
        utilNamespace: 'navigation',
        functionName: 'navigate1FE',
        widgetId,
        args: {
          arguments: { to, options },
        },
      });

      const targetHref = getTargetHref(to, options);

      // Navigate in the widget
      if (isSupportedOneDsNavOption(options)) {
        // If they want to navigate plugin to plugin we do it here
        if (options?.pluginToPluginNavigation) {
          externalRedirect(targetHref);
          return;
        }

        navigateWidget(to, options?.reactRouterOptions);

        if (options?.doNotUpdateUrl) {
          // return before hitting the navigateShell call at the bottom
          return;
        }
      } else {
        console.warn(
          '[UTILS][NAVIGATION] The use of the ReactRouterNavigateOptions options param type is deprecated and will be removed in the next major release. Please use the the overload with the SupportedOneDsNavOptions param type instead.',
        );

        navigateWidget(to, options);
      }

      if (window.location.pathname + window.location.search !== targetHref) {
        const navigateOptions = isSupportedOneDsNavOption(options)
          ? options?.reactRouterOptions
          : options;
        // navigateShell dispatches a `[shell] navigated` event as a side-effect
        navigateShell(getRouteWithParams(targetHref), navigateOptions);

        _publishNavigation();
      }
    };
  })();
