import React, { useEffect, useRef, ErrorInfo } from 'react';
import { useLocation } from 'react-router-dom';

// import { isIntegrationEnvironment } from '@1fe/helpers/isomorphic';
// import styled from '@emotion/styled';
// import { PluginConfig } from '../../isomorphic/types/widgetConfigs.types';
// import { getEnvironmentConfigs } from '../utils';

// import { Error } from './Error';
// import { AdditionalErrorInfo, OneDsErrorBoundary } from './OneDsErrorBoundary';
// import { readOneFEShellConfigs } from '../configs/shell-configs';
import { PluginConfig } from '../types/widget-config';
import { SHELL_NAVIGATED_EVENT } from '../constants/event-names';
import { getShellLogger } from '../utils/telemetry';
import { readOneFEShellConfigs } from '../configs/shell-configs';
import { OneDsErrorBoundary } from './OneDsErrorBoundary';
import { getGenericError } from './GenericError';
import { ENVIRONMENT_CONFIG } from '../configs/config-helpers';

export type RouteWrapperProps = {
  children: React.ReactNode;
  plugin?: PluginConfig;
};

export const RouteWrapper: React.FC<RouteWrapperProps> = ({
  children,
  plugin,
}): React.ReactElement => {
  const location = useLocation();
  const logger = getShellLogger();
  const previousPathRef = useRef(location?.pathname);

  // This catches back/forward button changes (or window.history.back/forward) and dispatches an event to the current plugin so they know to navigate
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(SHELL_NAVIGATED_EVENT, {
        detail: location,
      }),
    );

    logger.log({
      message: `[1FE-Shell] Route changed`,
      path: location?.pathname,
      from: previousPathRef.current,
      widgetId: plugin?.widgetId,
    });

    previousPathRef.current = location?.pathname;
  }, [location]);

  const handleError = (error: Error, info: ErrorInfo) => {
    logger.error({
      message: `[1FE-Shell] Unhandled Route Failure`,
      error,
      info,
      location: location,
    });
  };

  const IS_PROD = ENVIRONMENT_CONFIG.mode === 'production';
  const getError =
    readOneFEShellConfigs()?.components?.getError || getGenericError;

  // if (FEATURE_FLAGS.enable1feDevtool && isIntegrationEnvironment(ENVIRONMENT)) {
  //   return (
  //     <RootContainer>
  //       <DevtoolOrNull />
  //       {children}
  //     </RootContainer>
  //   );
  // }

  if (!IS_PROD) {
    return <>{children}</>;
  }

  return (
    <OneDsErrorBoundary
      fallbackComponent={getError({
        plugin,
      })}
      onError={handleError}
    >
      {children}
    </OneDsErrorBoundary>
  );
};
