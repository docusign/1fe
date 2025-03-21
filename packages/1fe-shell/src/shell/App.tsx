import { RouterProvider } from 'react-router-dom';
import { getRouter } from './components/Router';
import {
  AdditionalErrorInfo,
  OneDsErrorBoundary,
} from './components/OneDsErrorBoundary';
import { readOneFEShellConfigs } from './configs/shell-configs';
import { getShellLogger } from './utils/telemetry';
import { getGenericError } from './components/GenericError';

function App(): JSX.Element {
  const logger = getShellLogger();
  const getError = readOneFEShellConfigs()?.components?.getError || getGenericError;

  const handleError = (error: Error, info: AdditionalErrorInfo): void => {
    const pathname = window?.location?.pathname;

    logger.error({
      message: `[1FE-Shell] Unhandled App Failure`,
      error,
      info,
      path: pathname,
    });

    // shellLogger.logCounter(
    //   {
    //     measure: Date.now() - appLoadStartTime,
    //     instance: serverBuildNumber
    //       ? `${environment}-${serverBuildNumber}`
    //       : `${environment}`,
    //     success: false,
    //   },
    //   shellLoadCounterSource,
    // );
  };

  const handleRender = () => {
    const pathname = window?.location?.pathname;

    logger.log({
      message: `[1FE-Shell] App Rendered Successfully`,
      path: pathname,
    });

    // logger.logCounter(
    //   {
    //     measure: Date.now() - appLoadStartTime,
    //     instance: serverBuildNumber
    //       ? `${environment}-${serverBuildNumber}`
    //       : `${environment}`,
    //     success: true,
    //   },
    //   shellLoadCounterSource,
    // );
  };

  return (
    <OneDsErrorBoundary
      onRender={handleRender}
      onError={handleError}
      fallbackComponent={getError()}
    >
      <RouterProvider router={getRouter()} />
    </OneDsErrorBoundary>
  );
}

export default App;
