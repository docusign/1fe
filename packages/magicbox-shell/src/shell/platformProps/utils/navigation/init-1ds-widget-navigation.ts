import { useEffect } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import { type EventBusPlatformUtils } from '../event-bus/types';

import { getPluginRoute } from './get-plugin-route';
import { getRoute } from './get-route';
import { navigate1DS } from './navigate-1ds';
import { externalRedirect } from './external-redirect';
import { PlatformPropsType } from '../../../types/platform-utils';

type UseNavigateWidgetArgs = {
  widgetId: string;
  useNavigateWidget: typeof useNavigate;
  useLocationWidget: typeof useLocation;
};

export const SHELL_NAVIGATED_EVENT = '[shell] navigated';

// use1DSNavigationHandler gets called with every use of platformProps.utils.navigation.useNavigate()
// We only want to sync the widget's memory router with the browser router once
const alreadyDeepLinkedWidgets: Record<string, number> = {};

type UseSubscribeWidgetDeepLinkingArgs = {
  navigateWidget: NavigateFunction;
  widgetId: string;
};

/**
 *
 * Multiple copies of the same widget on the same page will be treated as one for now. Both would need to fully unmount for deeplinking to work properly.
 */
export const useSubscribeWidgetDeepLinking = ({
  navigateWidget,
  widgetId,
}: UseSubscribeWidgetDeepLinkingArgs) => {
  const shellLocation = useLocation();
  // const shellLocation = { state: 'asdf' };

  useEffect(() => {
    // This is the first instance of platformProps.utils.navigation.useNavigate to execute for this widget
    if (!alreadyDeepLinkedWidgets[widgetId]) {
      alreadyDeepLinkedWidgets[widgetId] = 1;

      const shellBrowserRoute = getRoute(widgetId)();
      // Sync widget's memory router with browser router (this includes syncing the state between the two routers)
      // Once react router is externalized, this can be replaced with initialEntries
      navigateWidget(shellBrowserRoute, { state: shellLocation?.state });
    } else {
      // The first instance of platformProps.utils.navigation.useNavigate has already executed for this widget
      alreadyDeepLinkedWidgets[widgetId]++;
    }

    return () => {
      alreadyDeepLinkedWidgets[widgetId]--;

      // The last instance of platformProps.utils.navigation.useNavigate has been cleaned
      // We can now deep link again if this widget is rendered again during this session
      if (alreadyDeepLinkedWidgets[widgetId] === 0) {
        delete alreadyDeepLinkedWidgets[widgetId];
      }
    };
  }, []);
};

/**
 * Internal hook to initialize deep linking and back/forward button handling. Executes in the consuming widget's react context.
 */
const use1DSNavigationHandler = ({
  widgetId,
  useNavigateWidget,
  useLocationWidget,
}: UseNavigateWidgetArgs) => {
  const navigateWidget = useNavigateWidget();
  const locationWidget = useLocationWidget();

  useSubscribeWidgetDeepLinking({ navigateWidget, widgetId });

  // Browser back/forward button (or window.history.back()/forward())
  useEffect(() => {
    // Type-guard util to narrow event type
    const isCustomEvent = (event: Event): event is CustomEvent => {
      return 'detail' in event;
    };

    const shellNavigationHandler = (event: Event) => {
      if (!isCustomEvent(event)) {
        throw new TypeError(`invalid event found ${event}`);
      }

      // converting what shell caught to a widget route
      const pluginRoute = getPluginRoute();

      const widgetRoute =
        pluginRoute !== event.detail.pathname
          ? event.detail.pathname.replace(pluginRoute, '')
          : '/';

      if (widgetRoute !== locationWidget.pathname) {
        // Don't need to have the shell update the URL since this is from a back/forward btn click which already did that work
        navigateWidget(widgetRoute, { state: event.detail.state });
      }
    };

    window.addEventListener(SHELL_NAVIGATED_EVENT, shellNavigationHandler); // aka back/forward button press or window.history.back() etc called

    return () => {
      window.removeEventListener(SHELL_NAVIGATED_EVENT, shellNavigationHandler); // aka back/forward button press or window.history.back() etc called
    };
  }, [locationWidget]); // <- This is vital for the value for the checks against .pathname to be the right value each time the effect runs
};

type Init1DSWidgetNavigationArgs = {
  widgetId: string;
  navigateShell?: NavigateFunction;
  eventBus: EventBusPlatformUtils;
  externalRedirect: ReturnType<typeof externalRedirect>;
  returnCallback?: boolean;
};

export type Navigate1DSFunction = ReturnType<typeof navigate1DS>;
export type UseNavigate = (
  navigateWidget: NavigateFunction,
  useNavigateWidget: typeof useNavigate,
  useLocationWidget: typeof useLocation,
) => Navigate1DSFunction;

export type Init1DSWidgetNavigation = <HostT>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any, // desperately needing platform props types package https://jira.corp.docusign.com/browse/ONEDS-57
  navigateWidget: NavigateFunction,
  useNavigateWidget: typeof useNavigate,
  useLocationWidget: typeof useLocation,
) => { platform: PlatformPropsType; host: HostT };

// platformProps.utils.navigation.useNavigate() can be called an unlimited number of times in the in each widget, but we only want to define it once.
const navigate1dsCallbackHashMap: Record<string, UseNavigate> = {};

export const init1DSWidgetNavigation = <
  ReturnT extends UseNavigate | Init1DSWidgetNavigation,
>({
  widgetId,
  navigateShell,
  eventBus,
  externalRedirect,
  returnCallback = false,
}: Init1DSWidgetNavigationArgs): ReturnT => {
  // if returnCallback, we want return a callback from platformProps.utils.navigation.useNavigate()
  // if !returnCallback, we want to monkey patch platformProps with navigate1DS defined
  if (returnCallback) {
    if (!navigate1dsCallbackHashMap[widgetId]) {
      const navigate1dsCallback: UseNavigate = (
        navigateWidget,
        useNavigateWidget,
        useLocationWidget,
      ) => {
        // __REACT SCOPE__
        // anything executed here is inside the consuming widget's react context
        // eslint-disable-next-line react-hooks/rules-of-hooks -- This is unsafe -- init1DSWidgetNavigation should be removed
        use1DSNavigationHandler({
          widgetId,
          useNavigateWidget,
          useLocationWidget,
        });

        return navigate1DS({
          navigateShell,
          navigateWidget,
          widgetId,
          eventBus,
          externalRedirect,
        });
      };

      navigate1dsCallbackHashMap[widgetId] = navigate1dsCallback;
    }

    return navigate1dsCallbackHashMap[widgetId] as ReturnT;
  }

  const _init1DSWidgetNavigation: Init1DSWidgetNavigation = (
    props,
    navigateWidget,
    useNavigateWidget,
    useLocationWidget,
  ) => {
    use1DSNavigationHandler({ widgetId, useNavigateWidget, useLocationWidget });

    // Monkey patches platform props to init navigate1DS
    // Encourage teams to switch to platformProps.utils.navigation.useNavigate1DS
    return {
      ...props,
      platform: {
        ...props.platform,
        utils: {
          ...props.platform.utils,
          navigation: {
            ...props.platform.utils.navigation,
            navigate1DS: navigate1DS({
              navigateShell,
              navigateWidget,
              widgetId,
              eventBus,
              externalRedirect,
            }),
          },
        },
      },
    };
  };

  return _init1DSWidgetNavigation as ReturnT;
};
