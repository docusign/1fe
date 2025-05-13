import deepFreeze from 'deep-freeze';

import { getPlatformUtils } from './utils';
import { getContext } from './context';
import { getDefaultWidgetOptions } from './utils/widgets/internal/utils/constants';
import { WidgetConfig } from '../types/widget-config';
import { PlatformPropsType, WidgetOptions } from '../types/platform-utils';
import { ENVIRONMENT_CONFIG } from '../configs/config-helpers';

export const getPlatformProps = (
  widget: WidgetConfig,
  options: WidgetOptions = getDefaultWidgetOptions(),
): PlatformPropsType => {
  const platformProps = {
    environment: ENVIRONMENT_CONFIG.environment,
    context: getContext(widget, options),
    utils: getPlatformUtils(widget),
  };

  return deepFreeze(platformProps);
};
