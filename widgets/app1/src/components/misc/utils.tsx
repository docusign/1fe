/* eslint-disable docusign-i18n/no-hard-coded-text */
// import { platformProps } from '@1ds/shell';
import React from 'react';

import { SkeletonLoader } from './skeletonLoader';

const INTERNAL_GENERIC_CHILD = '@1ds/starter-kit2';
const INTERNAL_GENERIC_VARIANTS = '@internal/generic-variants-widget';

export const GetChildWidget: React.FC<{
  isVisible: boolean;
  props: any;
  widgetId?: string;
}> = ({ isVisible, props, widgetId = INTERNAL_GENERIC_CHILD }) => {

  const Widget = props.platform.utils.widgets.get(widgetId);
  // const Widget = platformProps?.utils.widgets.get(widgetId);

  return isVisible ? <Widget {...props} /> : null;
};

export const GetChildWidgetWithCustomLoader: React.FC<{
  isVisible: boolean;
  props: any;
  widgetId?: string;
}> = ({ isVisible, props, widgetId = INTERNAL_GENERIC_CHILD }) => {
  const Widget = props.platform.utils.widgets.get(widgetId, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Remove when the Loader option is available in widgets.get() from @1ds/shell
    Loader: (
      <div data-qa='skeleton-loader'>
        <SkeletonLoader />
      </div>
    ),
  });

  // const Widget = platformProps?.utils.widgets.get(widgetId, {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore - Remove when the Loader option is available in widgets.get() from @1ds/shell
  //   Loader: (
  //     <div data-qa='skeleton-loader'>
  //       <SkeletonLoader />
  //     </div>
  //   ),
  // });

  return isVisible ? <Widget {...props} /> : null;
};

// export const GetVariant: React.FC<{
//   isVisible: boolean;
//   widgetId?: string;
//   variantId?: string;
// }> = ({
//   isVisible,
//   widgetId = INTERNAL_GENERIC_VARIANTS,
//   variantId = 'testVariant',
// }) => {
//   const Variant = platformProps?.utils.widgets.get(widgetId, { variantId });

//   return isVisible ? <Variant /> : null;
// };
