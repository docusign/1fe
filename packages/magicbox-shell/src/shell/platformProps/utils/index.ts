// If we want to use methods from @1ds/utils use them from here instead of having to import `platform1DSUtils` and call it
// DO NOT IMPORT FROM @1ds/utils you will get no contexual information
import { merge } from 'lodash';
import deepFreeze from 'deep-freeze';

// import { SESSION_ID_UNAVAILABLE } from '../../../constants';
import { router } from '../../components/Router';
// import { WidgetConfig } from '../../../isomorphic/types/widgetConfigs.types';
// import { getSessionIdFromCookie } from '../../utils/cookie-helpers';
// import { getBaseHrefUrl, getEnvironmentConfigs } from '../../utils/env-helpers';
// import { getIstioCdnFallbackUrl as _getIstioCdnFallbackUrl } from '../../utils/url-helpers';
// import { isWidgetTypePinned } from '../../../isomorphic/widgetConfigs/widgetType';

import { WidgetConfig } from '../../types/widget-config';
import { PlatformUtils } from '../../types/platform-utils';
import { initWidgetsHelper } from './widgets';
import { initNavigation } from './navigation';
// import { initLogger } from './logger';
// import { initNetwork } from './network';
// import { getAppLoadTimeUtils } from './app-load-time';
// import { initAuth } from './auth';
import { initEventBus } from './event-bus';
// import { WidgetAppLoadTimeUtils } from './app-load-time/types';
import { initSessionStorage } from './sessionStorage';
// import { initLocalStorage } from './localStorage';
// import { initExperiments } from './experiments';
// import { i18n as initi18n } from './i18n';
import { initExperience } from './experience';
// import { initAnalytics } from './analytics';
// import { DEFAULT_WIDGET_OPTIONS } from './widgets/internal/utils/constants';
// import { initOTEL } from './otel';
// import {
//   initializeOpenTelemetryMetrics,
//   initializeOpenTelemetryWebTracer,
// } from './otel/setup';
// import { initUserUtils } from './user';

export const getPlatformUtils = (
  widget: WidgetConfig,
  // TODO: strongly type if needed
  options: any = {} // DEFAULT_WIDGET_OPTIONS,
): PlatformUtils => {
  const { widgetId, type, version } = widget;
  // const { ENVIRONMENT, FEATURE_FLAGS } = getEnvironmentConfigs();
  // const sessionId = getSessionIdFromCookie() ?? SESSION_ID_UNAVAILABLE;

  // if (FEATURE_FLAGS.enableClientSideOtelAutomatedInstrumentation) {
  //   initializeOpenTelemetryWebTracer('', version, ENVIRONMENT, sessionId);
  //   initializeOpenTelemetryMetrics(version, ENVIRONMENT);
  // }

//   const logger = initLogger({
//     widget,
//     sessionId,
//     options,
//   });

//   // Some utils depend on others to execute since they use them
//   const appLoadTime = getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(
//     widget.widgetId,
//   );

  const widgets = initWidgetsHelper(widget);

  const eventBus = initEventBus(widget.widgetId);

  const navigation = initNavigation({
    widgetId,
    navigateShell: router.navigate,
    eventBus,
  });

//   const auth = initAuth(widget);

//   const network = initNetwork({
//     widgetId,
//     auth,
//     logger,
//   });

//   const user = initUserUtils(widget);

  const sessionStorage = initSessionStorage(widgetId);

//   const localStorage = initLocalStorage(widgetId);

//   const experiments = initExperiments(ENVIRONMENT, widgetId, logger);

//   const i18n = initi18n(widgetId);

  const experience = initExperience(widgetId);

//   const analytics = initAnalytics(widgetId);

//   const UNSAFE_otel = initOTEL(widget, options);

  const initializedPlatformUtils = merge({}, {}, {
    navigation,
    // network,
    // logger,
    widgets,
    // appLoadTime,
    // auth,
    // user,
    eventBus,
    sessionStorage,
    // localStorage,
    // experiments,
    // i18n,
    experience,
    // analytics,
    // UNSAFE_otel,
  });

  // TODO: Freeze
  return initializedPlatformUtils;
  // return deepFreeze(initializedPlatformUtils);
};
