import React, {
  ErrorInfo,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';

import { getShellLogger } from '../../../../../utils/telemetry';
import { OneDsErrorBoundary } from '../../../../../components/OneDsErrorBoundary';
import { WidgetConfig } from '../../../../../types/widget-config';
import { isOverrideElementActive } from '../../../../../init/import-map-ui';
import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../../1fe-server/src/server/utils/widget-config-helpers';
import { WIDGET_CONFIGS } from '../../../../../configs/config-helpers';
import { WidgetConfigs } from '../../../../../../../../1fe-server/src/server/types';

interface WidgetErrorBoundaryProps {
  /**
   * An unique id for the error boundary. Useful incase widget is not found
   */
  widgetFrameId: string;

  /**
   * The widget to be loaded in the frame
   * NOTE: Given that this property comes from a global config, we don't worry about its stability
   */
  requestedWidgetConfigOrUrl: WidgetConfig | URL;

  /**
   * The widgetId for the widget calling widgets.get()
   */
  hostWidgetId: string;

  /**
   * The fallback component to be rendered if the widget fails to load
   */
  fallback?: ReactElement;

  /**
   * The children of the widget or plugin
   */
  children: ReactNode;
}

/**
 * Error boundary for a Widget. If the widget fails to load, or if an error occurs while rendering
 * the widget, this component will catch the error and log it. If the widget configuration is not found,
 * it will also log an error.
 */
export function WidgetErrorBoundary({
  widgetFrameId,
  requestedWidgetConfigOrUrl,
  hostWidgetId,
  fallback,
  children,
}: WidgetErrorBoundaryProps): ReactElement {
  const renderStartTime = useRef(Date.now());
  const isActiveOverride = isOverrideElementActive();
  const logger = getShellLogger();
  const isUrl = requestedWidgetConfigOrUrl instanceof URL;
  const { type = undefined } = isUrl
    ? {}
    : getRequestedWidgetConfigWithoutRuntimeConfig({
        hostWidgetId,
        requestedWidgetId: requestedWidgetConfigOrUrl.widgetId,
        widgetConfigs: WIDGET_CONFIGS as WidgetConfigs,
      });

  // TODO: This is kinda pointless as it tells that the WidgetErrorBoundary has rendered
  // but not the widget itself. We should probably move this to the WidgetFrame and track the suspense?
  const handleRender = useCallback(() => {
    // const environment = getEnvironmentConfigs().ENVIRONMENT;
    // const serverBuildNumber = getEnvironmentConfigs().SERVER_BUILD_NUMBER;
    const isWidgetOverriden = isOverrideElementActive();
    renderStartTime.current = Date.now();

    logger.log({
      message: `[1FE-Shell] Widget rendered`,
      widget: isUrl
        ? { widgetId: widgetFrameId, version: '0.0.0' }
        : requestedWidgetConfigOrUrl,
      isOverrideActive: isWidgetOverriden,
      hostWidgetId,
      widgetId: widgetFrameId,
      ...(type && { type }),
      ...(isUrl
        ? { url: requestedWidgetConfigOrUrl.toString() }
        : { plugin: requestedWidgetConfigOrUrl }),
    });

    // TODO: [1fe-consumption] add logCounter
    // if (!isWidgetOverriden) {
    //   logger.logCounter(
    //     {
    //       measure: Date.now() - renderStartTime.current,
    //       instance: serverBuildNumber
    //         ? `${environment}-${serverBuildNumber}-${widgetFrameId}`
    //         : `${environment}-${widgetFrameId}`,
    //       success: true,
    //     },
    //     widgetRenderCounterSource,
    //   );
    // }
  }, []);

  const handleError = useCallback(
    (error: Error, info: ErrorInfo): void => {
      // const environment = getEnvironmentConfigs().ENVIRONMENT;
      // const serverBuildNumber = getEnvironmentConfigs().SERVER_BUILD_NUMBER;
      const isWidgetOverriden = isOverrideElementActive();

      logger.error({
        message: `[1FE-Shell] Widget failed to render`,
        error,
        info,
        isOverrideActive: isWidgetOverriden,
        hostWidgetId,
        ...(type && { type }),
        widget: isUrl
          ? { widgetId: widgetFrameId, version: '0.0.0' }
          : requestedWidgetConfigOrUrl,
        ...(isUrl
          ? { url: requestedWidgetConfigOrUrl.toString() }
          : { plugin: requestedWidgetConfigOrUrl }),
      });

      // if (!isWidgetOverriden) {
      //   logger.logCounter(
      //     {
      //       measure: Date.now() - renderStartTime.current,
      //       instance: serverBuildNumber
      //         ? `${environment}-${serverBuildNumber}-${widgetFrameId}`
      //         : `${environment}-${widgetFrameId}`,
      //       success: false,
      //     },
      //     widgetRenderCounterSource,
      //   );
      // }
    },
    [widgetFrameId, requestedWidgetConfigOrUrl],
  );

  return (
    <OneDsErrorBoundary
      widget={
        isUrl
          ? {
              widgetId: requestedWidgetConfigOrUrl.toString(),
              version: requestedWidgetConfigOrUrl.toString(),
              runtime: {},
            }
          : requestedWidgetConfigOrUrl
      }
      onRender={isActiveOverride ? undefined : handleRender}
      onError={isActiveOverride ? undefined : handleError}
      fallbackComponent={fallback}
      // TODO: add a nice fallback for when widget loading fails https://jira.corp.docusign.com/browse/ONEDS-594
      // TODO: add a reset logic to retry loading a widget if it fails
    >
      {children}
    </OneDsErrorBoundary>
  );
}
