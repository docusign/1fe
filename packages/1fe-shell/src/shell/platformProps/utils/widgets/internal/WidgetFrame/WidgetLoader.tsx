import React, { PropsWithChildren, Suspense, useMemo } from 'react';
import { MemoryRouter, UNSAFE_LocationContext } from 'react-router-dom';

import { getDefaultWidgetOptions } from '../utils/constants';
import { downloadWidget } from './downloadWidget';
import { WidgetRenderStatusType } from './types';
import { WidgetConfig } from '../../../../../types/widget-config';
import { WidgetOptions } from '../../../../../types/platform-utils';
import { addScopedImportMapForPlatformProps } from '../../../../../utils/system-helpers';
import { getPlatformProps } from '../../../..';

interface WidgetLoaderProps<
  TWidgetProps,
  TLoadType extends WidgetConfig | URL,
> {
  /**
   * An unique id for the frame, useful incase widget is not found
   */
  widgetFrameId: string;

  /**
   * The Widget to be loaded in the frame
   */
  requestedWidgetConfigOrUrl: TLoadType;

  /**
   * A function to update the widget loading status in the frame
   */
  setWidgetRenderStatus: React.Dispatch<
    React.SetStateAction<WidgetRenderStatusType>
  >;

  /**
   * Props to be passed to the widget or plugin
   */
  widgetProps: TWidgetProps;

  /**
   * The widgetId for the widget calling widgets.get()
   */
  hostWidgetId: string;

  /**
   * Options passed to widgets.get()
   */
  options: WidgetOptions;
}

export function WidgetLoader<TWidgetProps>({
  widgetFrameId,
  requestedWidgetConfigOrUrl,
  widgetProps,
  setWidgetRenderStatus,
  options: { variantId, Loader }, // dragon: always deconstruct options to maintain stability in useMemo calls below
  hostWidgetId,
}: WidgetLoaderProps<TWidgetProps, WidgetConfig>): React.ReactElement | null {
  const { widgetId, version } = requestedWidgetConfigOrUrl;

  const platformProps = useMemo(
    () =>
      getPlatformProps(requestedWidgetConfigOrUrl, {
        variantId,
        Loader,
      }),
    [`${widgetId}@${version}`, variantId],
  );

  const { children, ...hostProps } =
    widgetProps as PropsWithChildren<TWidgetProps>;

  const LazyWidget = useMemo(() => {
    return React.lazy(() =>
      downloadWidget<TWidgetProps>(widgetId, setWidgetRenderStatus, {
        widgetFrameId,
        requestedWidgetConfigOrUrl,
        hostProps,
        hostWidgetId,
        widgetOptions: {
          variantId,
          Loader,
        },
      }),
    );
  }, [`${widgetId}@${version}`, variantId]);

  addScopedImportMapForPlatformProps(widgetId, platformProps);

  const widget = (
    // @ts-expect-error temporary solution for nested routers until react-router-dom is externalized, track work here: https://docusign.atlassian.net/browse/ONEDS-708
    <UNSAFE_LocationContext.Provider value={null}>
      <MemoryRouter>
        <LazyWidget platform={platformProps} host={hostProps}>
          {children}
        </LazyWidget>
      </MemoryRouter>
    </UNSAFE_LocationContext.Provider>
  );

  return (
    <Suspense
      // TODO: switch to a shimmer
      // Text is hidden via styling. Removing this breaks the loading-spinner e2e snapshot test as:
      //  - The text node in the document triggers CSS font fetches
      //  - The e2e test adds artificial delay to the 1fe-bundle via page.route handler
      //  - Playwright does not fully support this, and it causes _all_ subsequent routes to pend as well
      //  - Playwright snapshots also delay snapshots until fonts are loaded (document.fonts.ready)
      //  - By removing the text node here, the snapshot test will no longer work
      //  - Consider upvoting: https://github.com/microsoft/playwright/issues/8622
      fallback={Loader}
      key={`${widgetFrameId}-suspense`}
    >
      {widget}
    </Suspense>
  );
}

// TODO: Either reuse WidgetLoader or move this to a separate file
export function WidgetURLLoader<TWidgetProps>({
  widgetFrameId,
  requestedWidgetConfigOrUrl,
  setWidgetRenderStatus,
  widgetProps = {} as TWidgetProps,
  hostWidgetId,
  options: { variantId }, // dragon: always deconstruct options to maintain stability in useMemo calls below
}: WidgetLoaderProps<TWidgetProps, URL>): React.ReactElement | null {
  const Loader = getDefaultWidgetOptions().Loader;
  const platformProps = useMemo(
    () =>
      getPlatformProps(
        {
          widgetId: requestedWidgetConfigOrUrl.toString(),
          version: '0.0.0',
          runtime: {},
        },
        {
          variantId,
          Loader,
        },
      ),
    [requestedWidgetConfigOrUrl, variantId],
  );

  addScopedImportMapForPlatformProps('test-widget', platformProps);

  const { children, ...hostProps } =
    widgetProps as PropsWithChildren<TWidgetProps>;

  const LazyWidget = useMemo(() => {
    return React.lazy(() =>
      downloadWidget<TWidgetProps>(
        requestedWidgetConfigOrUrl,
        setWidgetRenderStatus,
        {
          widgetFrameId,
          requestedWidgetConfigOrUrl,
          hostProps,
          hostWidgetId,
          widgetOptions: {
            variantId,
            Loader,
          },
        },
      ),
    );
  }, [requestedWidgetConfigOrUrl, variantId]);

  return (
    <Suspense
      fallback={Loader}
      key={`${requestedWidgetConfigOrUrl.toString()}-suspense`}
    >
      <LazyWidget platform={platformProps} host={hostProps}>
        {children}
      </LazyWidget>
    </Suspense>
  );
}
