import deepFreeze from 'deep-freeze';


import { getPlatformUtils } from './utils';
import { getContext } from './context';
import { getDefaultWidgetOptions } from './utils/widgets/internal/utils/constants';
import { WidgetConfig } from '../types/widget-config';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';
import { PlatformPropsType, WidgetOptions } from '../types/platform-utils';

export const getPlatformProps = (
  widget: WidgetConfig,
  options: WidgetOptions = getDefaultWidgetOptions(),
): PlatformPropsType => {
  const platformProps = {
    environment: readMagicBoxShellConfigs().environment,
    context: getContext(widget, options),
    utils: getPlatformUtils(widget),
  };

  return platformProps;
  // TODO[1fe]: FREEZE
  // return deepFreeze(platformProps);
};
