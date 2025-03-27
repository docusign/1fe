/* eslint-disable docusign-i18n/no-hard-coded-text */
import { platformProps } from '@devhub/1fe-shell';
import React from 'react';

import { SkeletonLoader } from './skeletonLoader';

const INTERNAL_GENERIC_CHILD = '@1fe/starter-kit2';
const INTERNAL_GENERIC_VARIANTS = '@internal/generic-variants-widget';

export const GetChildWidget: React.FC<{
  isVisible: boolean;
  widgetId?: string;
}> = ({ isVisible, widgetId = INTERNAL_GENERIC_CHILD }) => {
  const Widget = platformProps.utils.widgets.get(widgetId);
  // const Widget = platformProps?.utils.widgets.get(widgetId);

  return isVisible ? <Widget /> : null;
};

export const GetChildWidgetWithCustomLoader: React.FC<{
  isVisible: boolean;
  widgetId?: string;
}> = ({ isVisible, widgetId = INTERNAL_GENERIC_CHILD }) => {
  const Widget = platformProps.utils.widgets.get(widgetId, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Remove when the Loader option is available in widgets.get() from @1fe/shell
    Loader: (
      <div data-qa='skeleton-loader'>
        <SkeletonLoader />
      </div>
    ),
  });

  // const Widget = platformProps?.utils.widgets.get(widgetId, {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore - Remove when the Loader option is available in widgets.get() from @1fe/shell
  //   Loader: (
  //     <div data-qa='skeleton-loader'>
  //       <SkeletonLoader />
  //     </div>
  //   ),
  // });

  return isVisible ? <Widget /> : null;
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
