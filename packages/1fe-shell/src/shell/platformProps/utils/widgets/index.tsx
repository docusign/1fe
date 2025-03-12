import React, { memo, useMemo } from 'react';

import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../1fe-server/src/server/utils/widget-config-helpers';
import { WidgetFrame } from './internal/WidgetFrame';
import { queueWidgetPreloadsIfFound } from './internal/utils/widgetConfigUtils';
import { getDefaultWidgetOptions } from './internal/utils/constants';
import { widgetDependencyTree } from '../../../utils/tree';
import { isWidgetTypeSystem } from '../../../utils/widget-type';
import { WIDGET_CONFIGS } from '../../../configs/config-helpers';
import { WidgetConfig } from '../../../types/widget-config';
import { isInUseMemo } from './internal/utils/isInUseMemo';
import {
    VariantProps,
    WidgetNavigation,
    WidgetOptions,
    WidgetProps,
  } from '../../../types/platform-utils';
import { getShellLogger } from '../../../utils/telemetry';

const EMPTY_WIDGET = () => null;

type GetByUrl =
  | (<TWidgetProps = Record<string, unknown>>(
      url: string,
      options?: Partial<WidgetOptions>,
    ) => React.FC<TWidgetProps>)
  | (() => void);

export const initWidgetsHelper = (
  hostWidget: WidgetConfig,
): WidgetNavigation & {
  getByUrl: GetByUrl;
} => ({
  get: <
    TWidgetId extends string,
    TVariantId extends string | undefined = undefined,
    TWidgetProps = TVariantId extends string
      ? VariantProps[TWidgetId][TVariantId]
      : WidgetProps[TWidgetId],
  >(
    requestedWidgetId: TWidgetId,
    options?: {
      variantId?: TVariantId;
      Loader?: React.ReactNode;
    },
  ): React.FC<TWidgetProps> => {
    const {
      // The default variantId is the "default" export
      variantId = getDefaultWidgetOptions().variantId,
      // The default loading component is a spinner
      Loader = getDefaultWidgetOptions().Loader,
    } = options || {};
    const logger = getShellLogger();
    const isGetCalledInsideAUseMemo = isInUseMemo();

    if (!isGetCalledInsideAUseMemo) {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- We presume that widgets.get is being called unconditionally from a function component, and that `isGetCalledInsideAUseMemo` is stable during render
      return useMemo(() => {
        const { requestedWidgetConfig } =
          getRequestedWidgetConfigWithoutRuntimeConfig({
            hostWidgetId: hostWidget.widgetId,
            requestedWidgetId,
            widgetConfigs: WIDGET_CONFIGS,
          });

        if (!requestedWidgetConfig) {
          return EMPTY_WIDGET;
        }

        // NOTE: Don't confuse memo with useMemo.
        // memo is used to ensure that the widget is not re-rendered if the props are the same via shallow comparision.
        // useMemo is used to ensure that the widget's factory function is stable and doesn't change on every render.
        return memo(function WidgetGetWrapper(props: TWidgetProps) {
            // Queue preloads for API Calls and dependent child widgets if found in the requested widget's runtime config.
            queueWidgetPreloadsIfFound(hostWidget, requestedWidgetConfig);

          const widgetNode = widgetDependencyTree.add(
            requestedWidgetId,
            requestedWidgetConfig,
            'widget',
            widgetDependencyTree.getByKey(hostWidget.widgetId),
          );

          return (
            <WidgetFrame
              requestedWidgetConfigOrUrl={requestedWidgetConfig}
              widgetProps={props}
              widgetNodeId={widgetNode.id}
              hostWidgetId={hostWidget.widgetId}
              options={{
                variantId,
                Loader,
              }}
            />
          );
        }) as React.FC<TWidgetProps>;
      }, [requestedWidgetId, variantId]);
    }

    try {
      const { requestedWidgetConfig } =
        getRequestedWidgetConfigWithoutRuntimeConfig({
          hostWidgetId: hostWidget.widgetId,
          requestedWidgetId,
          widgetConfigs: WIDGET_CONFIGS,
        });

      return memo(function WidgetGetWrapper(props: TWidgetProps) {
          // Queue preloads for API Calls and dependent child widgets if found in the requested widget's runtime config.
          queueWidgetPreloadsIfFound(hostWidget, requestedWidgetConfig);

        const widgetNode = widgetDependencyTree.add(
          requestedWidgetId,
          requestedWidgetConfig,
          'widget',
          widgetDependencyTree.getByKey(hostWidget.widgetId),
        );

        return (
          <WidgetFrame
            requestedWidgetConfigOrUrl={requestedWidgetConfig}
            widgetProps={props}
            widgetNodeId={widgetNode.id}
            hostWidgetId={hostWidget.widgetId}
            options={{
              variantId,
              Loader,
            }}
          />
        );
      }) as React.FC<TWidgetProps>;
    } catch (err) {
      logger.error({
        message: '[WIDGETS][GET] error',
        tag: '[WIDGETS][GET]',
        error: err,
        widgetId: hostWidget.widgetId
      });
    }

    return EMPTY_WIDGET;
  },
  getByUrl: isWidgetTypeSystem(hostWidget?.type)
    ? // only system widgets can use getByUrl
      <TWidgetProps = Record<string, unknown>,>(
        url: string,
        {
          variantId = getDefaultWidgetOptions().variantId,
        }: Partial<WidgetOptions> = getDefaultWidgetOptions(),
      ): React.FC<TWidgetProps> => {
        const isGetCalledInsideAUseMemo = isInUseMemo();
        const Loader = getDefaultWidgetOptions().Loader;

        const widgetNode = widgetDependencyTree.add(
          url,
          hostWidget,
          'widget',
          widgetDependencyTree.getByKey(hostWidget.widgetId),
        );

        if (!isGetCalledInsideAUseMemo) {
          return useMemo(() => {
            // NOTE: Don't confuse memo with useMemo.
            // memo is used to ensure that the widget is not re-rendered if the props are the same via shallow comparision.
            // useMemo is used to ensure that the widget's factory function is stable and doesn't change on every render.
            return memo(function WidgetGetWrapper(props: TWidgetProps) {
              return (
                <WidgetFrame
                  requestedWidgetConfigOrUrl={new URL(url)}
                  widgetProps={props}
                  widgetNodeId={widgetNode.id}
                  hostWidgetId={hostWidget.widgetId}
                  options={{
                    variantId,
                    Loader,
                  }}
                />
              );
            }) as React.FC<TWidgetProps>;
          }, [url, variantId]);
        }

        return React.memo(function WidgetGetWrapper(props: TWidgetProps) {
          return (
            <WidgetFrame
              requestedWidgetConfigOrUrl={new URL(url)}
              widgetNodeId={widgetNode.id}
              widgetProps={props}
              hostWidgetId={hostWidget.widgetId}
              options={{
                variantId,
                Loader,
              }}
            />
          );
        }) as React.FC<TWidgetProps>;
      }
    : // noop for non system widgets
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (): void => {},
});
