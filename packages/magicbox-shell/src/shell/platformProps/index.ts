import deepFreeze from 'deep-freeze';


import { getPlatformUtils } from './utils';
import { getContext } from './context';
import { DEFAULT_WIDGET_OPTIONS } from './utils/widgets/internal/utils/constants';
import { WidgetConfig } from '../types/widget-config';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';
import { PlatformPropsType, WidgetOptions } from '../types/platform-utils';

export const getPlatformProps = (
  widget: WidgetConfig,
  options: WidgetOptions = DEFAULT_WIDGET_OPTIONS,
): PlatformPropsType => {
  const platformProps = {
    environment: readMagicBoxShellConfigs().environment,
    context: getContext(widget, options),
    utils: getPlatformUtils(widget, options),
  };

  return platformProps;
  // TODO: FREEZE
  // return deepFreeze(platformProps);
};
