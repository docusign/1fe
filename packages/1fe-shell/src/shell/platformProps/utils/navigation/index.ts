import { NavigateFunction } from 'react-router-dom';

import { type EventBusPlatformUtils } from '../event-bus/types';

import { preloadUrl } from './preload-url';
import { externalRedirect as initExternalRedirect } from './external-redirect';
import { getAbsoluteWidgetPath } from './get-absolute-widget-path';
import { getRoute } from './get-route';
import {
  getPluginRoute,
  getPluginRouteWithTelemetry,
} from './get-plugin-route';
import {
  UseNavigate,
  init1FEWidgetNavigation,
} from './init-1fe-widget-navigation';
import { navigate1FE } from './navigate-1fe';
import { initGo } from './go';
// import { buildCreateLinkComponentFn } from './link';
// import { useLinkClickHandler } from './use-link-click-handler';

export type { SupportedOneDsNavOptions } from './navigation-options';

type NavigationArgs = {
  widgetId: string;
  navigateShell: NavigateFunction;
  eventBus: EventBusPlatformUtils;
};

export const initNavigation = ({
  widgetId,
  eventBus,
  navigateShell,
}: NavigationArgs) => {
  const externalRedirect = initExternalRedirect(widgetId);
  const useNavigate = init1FEWidgetNavigation<UseNavigate>({
    widgetId,
    navigateShell,
    eventBus,
    externalRedirect,
    returnCallback: true,
  });

  return {
    externalRedirect,
    preloadUrl: preloadUrl(widgetId),
    getAbsoluteWidgetPath,
    getRoute: getRoute(widgetId),
    getPluginRoute: getPluginRouteWithTelemetry(widgetId),
    // This method will throw until it is initialized with the widget's navigation context
    navigate1FE: (() => {
      throw new TypeError(
        'call init1FEWidgetNavigation first to use this method',
      );
      // We need to cast the type to the function's type after it is initialized
    }) as ReturnType<typeof navigate1FE>,
    useNavigate,
    go: initGo(widgetId),
    // createLinkComponent: buildCreateLinkComponentFn({
    //   widgetId,
    //   navigateShell,
    //   eventBus,
    //   externalRedirect,
    // }),
    // useLinkClickHandler,
  };
};
