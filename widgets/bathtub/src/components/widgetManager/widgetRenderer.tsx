import { memo, useEffect, useMemo } from 'react';

import { ErrorOverlay } from '../../components/errorOverlay';
import { WidgetProps } from '../../contract';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectActiveWidgetProps,
  selectActiveWidgetUrl,
  selectWidgetRefreshSignal,
} from '../../store/app';
// import {
//   DEFAULT_VARIANT,
//   widgetBrowserActions,
//   widgetBrowserSelectors,
// } from '../../../store/widgetBrowser';
// import { widgetBrowserThunks } from '../../store/widgetBrowser/thunks';

const safeParseProps = (widgetProps: string) => {
  try {
    return eval('(' + widgetProps + ')');
  } catch (e) {
    return {
      kitchenSink: 'testing',
    };
  }
};

const WidgetRenderer: React.FC<WidgetProps> = memo(({ platform }) => {
  const dispatch = useAppDispatch();
  const widgetUrl = useAppSelector(selectActiveWidgetUrl);
  const widgetProps = useAppSelector(selectActiveWidgetProps);
  const widgetRefresh = useAppSelector(selectWidgetRefreshSignal);
  // const widgetVariant = useAppSelector(
  //   widgetBrowserSelectors.selectPickedVariant,
  // );

  // useEffect(() => {
  //   dispatch(widgetBrowserThunks.refreshVariants());

  //   return () => {
  //     dispatch(widgetBrowserActions.clearVariants());
  //   };
  // }, [dispatch, widgetUrl]);

  const Widget = useMemo(() => {
    if (!widgetUrl) return undefined;
    widgetRefresh; // empty statement to trigger re-mounts
    // const options =
    //   widgetVariant === DEFAULT_VARIANT
    //     ? undefined
    //     : { variantId: widgetVariant };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we intentionally use `any` here, since we are using the `getByUrl` method from the `widgets` object, which is not available to all widgets and is hidden.
    return (platform.utils.widgets as any).getByUrl(widgetUrl);
  }, [widgetUrl, widgetRefresh]);

  const widgetPropsToPass = safeParseProps(widgetProps);

  return (
    <ErrorOverlay>
      <Widget {...widgetPropsToPass} />
    </ErrorOverlay>
  );
});

export { WidgetRenderer };
