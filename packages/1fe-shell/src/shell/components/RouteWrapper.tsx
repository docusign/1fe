import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// import { isIntegrationEnvironment } from '@1ds/helpers/isomorphic';
// import styled from '@emotion/styled';
// import { PluginConfig } from '../../isomorphic/types/widgetConfigs.types';
// import { getEnvironmentConfigs } from '../utils';

// import { Error } from './Error';
// import { AdditionalErrorInfo, OneDsErrorBoundary } from './OneDsErrorBoundary';
// import { readMagicBoxShellConfigs } from '../configs/shell-configs';
import { PluginConfig } from '../types/widget-config';
import { SHELL_NAVIGATED_EVENT } from '../constants/event-names';
import { getShellLogger } from '../utils/telemetry';

export type RouteWrapperProps = {
  children: React.ReactNode;
  plugin?: PluginConfig;
};

export const RouteWrapper: React.FC<RouteWrapperProps> = ({
  children,
  plugin,
}): React.ReactElement => {
  const location = useLocation();
  // TODO: What do we do with logging? Should we support it?
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
      message: `[1DS-Shell] Route changed`,
      path: location?.pathname,
      from: previousPathRef.current,
      widgetId: plugin?.widgetId,
    });

    previousPathRef.current = location?.pathname;
  }, [location]);

  // const handleError = (error: Error, info: AdditionalErrorInfo) => {
  //   logger.error({
  //     message: `[1DS-Shell] Unhandled Route Failure`,
  //     error,
  //     info,
  //     location: location,
  //   });
  // };


  // const IS_PROD = readMagicBoxShellConfigs().mode === 'production';
  
  // if (FEATURE_FLAGS.enable1dsDevtool && isIntegrationEnvironment(ENVIRONMENT)) {
  //   return (
  //     <RootContainer>
  //       <DevtoolOrNull />
  //       {children}
  //     </RootContainer>
  //   );
  // }

  // TODO: Do we want to allow customization of Error Boundary?
  // if (!IS_PROD) {
    return <>{children}</>;
  // }

  // return (
  //   <OneDsErrorBoundary
  //     fallbackComponent={<Error plugin={plugin} />}
  //     onError={handleError}
  //   >
  //     {children}
  //   </OneDsErrorBoundary>
  // );
};
