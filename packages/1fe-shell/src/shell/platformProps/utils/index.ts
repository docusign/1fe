// If we want to use methods from @1fe/utils use them from here instead of having to import `platform1FEUtils` and call it
// DO NOT IMPORT FROM @1fe/utils you will get no contexual information
import { merge } from 'lodash';
import deepFreeze from 'deep-freeze';

// import { SESSION_ID_UNAVAILABLE } from '../../../constants';
import { getRouter } from '../../components/Router';
// import { WidgetConfig } from '../../../isomorphic/types/widgetConfigs.types';
// import { getSessionIdFromCookie } from '../../utils/cookie-helpers';
// import { getBaseHrefUrl, getEnvironmentConfigs } from '../../utils/env-helpers';
// import { getIstioCdnFallbackUrl as _getIstioCdnFallbackUrl } from '../../utils/url-helpers';
// import { isWidgetTypePinned } from '../../../isomorphic/widgetConfigs/widgetType';

import { WidgetConfig } from '../../types/widget-config';
import { PlatformUtils } from '../../types/platform-utils';
import { initWidgetsHelper } from './widgets';
// import { initLogger } from './logger';
// import { initNetwork } from './network';
// import { getAppLoadTimeUtils } from './app-load-time';
// import { initAuth } from './auth';
import { initEventBus } from './event-bus';
// import { WidgetAppLoadTimeUtils } from './app-load-time/types';
import { initSessionStorage } from './sessionStorage';
import { initLocalStorage } from './localStorage';
// import { initExperiments } from './experiments';
// import { i18n as initi18n } from './i18n';
import { initExperience } from './experience';
import { readOneFEShellConfigs } from '../../configs/shell-configs';
import { getAppLoadTimeUtils } from './app-load-time';
import { WidgetAppLoadTimeUtils } from './app-load-time/types';
// import { initAnalytics } from './analytics';
// import { DEFAULT_WIDGET_OPTIONS } from './widgets/internal/utils/constants';
// import { initOTEL } from './otel';
// import {
//   initializeOpenTelemetryMetrics,
//   initializeOpenTelemetryWebTracer,
// } from './otel/setup';
// import { initUserUtils } from './user';

type ExtendedPlatformUtils = PlatformUtils<{
  [key: string]: Record<string, object>;
}>;

export const getPlatformUtils = (
  widget: WidgetConfig,
): ExtendedPlatformUtils => {
  const { widgetId, type, version } = widget;

  // Some utils depend on others to execute since they use them
  const appLoadTime = getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(
    widget.widgetId,
  );

  const widgets = initWidgetsHelper(widget);

  const eventBus = initEventBus(widget.widgetId);

  const sessionStorage = initSessionStorage(widgetId);

  const localStorage = initLocalStorage(widgetId);

  const experience = initExperience(widgetId);

  const shellUtilOverrides = readOneFEShellConfigs().utils;

  const processedUtilOverrides = shellUtilOverrides
    ? Object.values(shellUtilOverrides).reduce((acc, currUtil) => {
        const customUtilities = currUtil(widgetId);
        if (customUtilities) {
          return {
            ...acc,
            ...customUtilities,
          };
        }
        return acc;
      }, {})
    : {};

  const initializedPlatformUtils = merge(
    {},
    {
      widgets,
      appLoadTime,
      eventBus,
      sessionStorage,
      localStorage,
      experience,
    },
    processedUtilOverrides,
  );

  return deepFreeze(initializedPlatformUtils);
};
