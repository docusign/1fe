import { RouterProvider } from 'react-router-dom';
import { getRouter } from './components/Router';
import { AdditionalErrorInfo, OneDsErrorBoundary } from './components/OneDsErrorBoundary';
import { readMagicBoxShellConfigs } from './configs/shell-configs';
import { getShellLogger } from './utils/telemetry';

function App(): JSX.Element {
  const logger = getShellLogger();
  const getError = readMagicBoxShellConfigs().components.getError;

  const handleError = (error: Error, info: AdditionalErrorInfo): void => {
    const pathname = window?.location?.pathname;

    logger.error({
      message: `[1DS-Shell] Unhandled App Failure`,
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
      message: `[1DS-Shell] App Rendered Successfully`,
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
