import { ErrorBoundary } from 'react-error-boundary';
import { ReactElement, useEffect, ErrorInfo } from 'react';

import { getShellLogger } from '../utils/telemetry';
import { WidgetConfig } from '../types/widget-config';

type OneDsErrorBoundaryProps = {
  widget?: WidgetConfig;
  fallbackComponent?: ReactElement;
  children: React.ReactNode;
  onError?: (e: Error, i: ErrorInfo) => void;
  onRender?: () => void;
};

export const OneDsErrorBoundary = ({
  children,
  widget,
  fallbackComponent,
  onError,
  onRender,
}: OneDsErrorBoundaryProps) => {
  const logger = getShellLogger();

  useEffect(() => {
    if (onRender) {
      onRender();
    }
  }, [onRender]);

  useEffect(() => {
    logger.log({
      message: `[1FE Shell] Rendering widget `,
      widget,
    });
  }, [widget]);

  const handleError = (error: Error, info: ErrorInfo): void => {
    if (onError) {
      onError(error, info);
    } else {
      logger.error({
        message: widget
          ? `[1FE-Shell] Failure with the following: \n ${widget?.plugin?.route} \n ${widget.widgetId} \n ${widget.version}`
          : `[1FE-Shell] An error has occured.`,
        error,
        info,
        widget,
      });
    }
  };

  return (
    // DRAGON! ErrorBoundaries need a fallback.
    // On a widget level we don't want to show a fallback
    // unless the parent Widget renders the fallback. This is because we want the error to bubble up
    // to the parent Widget so that it can decide what to do with the error.
    //
    // We have to find a better approach for this.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <ErrorBoundary onError={handleError} fallback={fallbackComponent!}>
      {children}
    </ErrorBoundary>
  );
};
