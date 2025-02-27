import styled from '@emotion/styled';
import React, { useEffect } from 'react';

import { getRequestedWidgetVersionForConsole } from '../utils/widgetConfigUtils';
import { WidgetLoader, WidgetURLLoader } from './WidgetLoader';
import { WidgetRenderStatusType } from './types';
import { WidgetConfig } from '../../../../../types/widget-config';
import { WidgetOptions } from '../../../../../types/platform-utils';
import { readMagicBoxShellConfigs } from '../../../../../configs/shell-configs';
import { getShellLogger } from '../../../../../utils/telemetry';

interface WidgetFrameProps<TWidgetProps> {
  /**
   * Every mounted widget has a node in the widget dependency tree to track the the Shell's mount heirarchial load
   */
  widgetNodeId: string;

  /**
   * The widget to be loaded in the frame
   */
  requestedWidgetConfigOrUrl: WidgetConfig | URL;

  /**
   * Props to be passed to the widget
   */
  widgetProps?: TWidgetProps;

  /**
   * The fallback component to be rendered if the widget fails to load
   * TODO: introduce null fallback to render nothing
   */
  fallback?: React.ReactElement;

  /**
   * The frame is never going to support children being passed to it
   */
  children?: never;

  /**
   * The widgetId for the widget calling widgets.get()
   */
  hostWidgetId: string;

  /**
   * The options passed to the widgets.get function as a second argument
   */
  options: WidgetOptions;
}

const WidgetInfo = styled.div({
  width: '100%',
  height: '100%',
});

function WidgetFrameInner<TWidgetProps>({
  requestedWidgetConfigOrUrl,
  widgetProps = {} as TWidgetProps,
  widgetNodeId,
  fallback,
  hostWidgetId,
  options,
}: WidgetFrameProps<TWidgetProps>): React.ReactElement {
  const isUrl = requestedWidgetConfigOrUrl instanceof URL;

  const versionRequest = isUrl
    ? requestedWidgetConfigOrUrl.toString()
    : requestedWidgetConfigOrUrl?.version;

  const widgetFrameId = isUrl
    ? requestedWidgetConfigOrUrl.toString()
    : requestedWidgetConfigOrUrl?.widgetId;

  const [widgetRenderStatus, setWidgetRenderStatus] =
    React.useState<WidgetRenderStatusType>('loading');

  useEffect(() => {
    if (readMagicBoxShellConfigs().mode === 'production') {
      return;
    }

    const widgetVersion = getRequestedWidgetVersionForConsole(
      hostWidgetId,
      requestedWidgetConfigOrUrl,
    );

    const requestedWidgetStr = isUrl
      ? widgetFrameId
      : `${widgetFrameId}@${widgetVersion}`;

    const consoleLogMountEvent = (event: 'mounted' | 'unmounted') => {
      // eslint-disable-next-line no-console
      console.log(
        `[1DS] %c${hostWidgetId} %c${event} %c${requestedWidgetStr}`,
        'font-weight:bold',
        '',
        'font-weight:bold',
      );
    };

    consoleLogMountEvent('mounted');

    return () => {
      consoleLogMountEvent('unmounted');
    };
  }, [widgetFrameId]);

  // Render nothing if requestedWidgetConfigOrUrl is null or undefined, let the error boundary handle it
  // else render the widget via the appropriate loader
  const mayBeWidget = !requestedWidgetConfigOrUrl ? null : isUrl ? (
    <WidgetURLLoader
      widgetFrameId={widgetFrameId}
      widgetProps={widgetProps}
      setWidgetRenderStatus={setWidgetRenderStatus}
      requestedWidgetConfigOrUrl={requestedWidgetConfigOrUrl}
      hostWidgetId={hostWidgetId}
      options={options}
    />
  ) : (
    <WidgetLoader
      widgetFrameId={widgetFrameId}
      widgetProps={widgetProps}
      requestedWidgetConfigOrUrl={requestedWidgetConfigOrUrl}
      setWidgetRenderStatus={setWidgetRenderStatus}
      hostWidgetId={hostWidgetId}
      options={options}
    />
  );

  if (mayBeWidget === null) {
    // This error is bubbled up either to the caller for WidgetFrame
    // or to the parent widget's error boundary
    throw WidgetNotFoundError(widgetFrameId);
  }

  // TODO: ADD BACK THE ERROR BOUNDARY
  return (
    <WidgetInfo
      data-qa='widget.frame'
      data-widget-id={widgetFrameId}
      data-node-id={widgetNodeId}
      data-widget-version={versionRequest}
      data-widget-render-status={widgetRenderStatus}
      // if url given, we don't know if it's a plugin or not, could be engineered
      data-is-plugin={isUrl ? false : !!requestedWidgetConfigOrUrl?.plugin}
    >
        {mayBeWidget}
    </WidgetInfo>
  );
}

/**
 * Exported for unit testing
 */
export function WidgetNotFoundError(widgetId: string): Error {
  const logger = getShellLogger();
  const errorMsg = `WidgetId ${widgetId} does not exist in import-map config`;

  logger.error({ tag: '[WIDGETS][GET]', message: errorMsg, widgetId });

  throw new Error(`[WIDGETS][GET] ${errorMsg}`);
}

/**
 * An holistic component that loads a widget in a frame and handles all the error cases.
 * Also responsible for passing any specific contextual information to the widget such as i18n, telemetry, etc.
 */
export const WidgetFrame = React.memo(
  WidgetFrameInner,
) as typeof WidgetFrameInner;
