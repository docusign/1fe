import { getShellWidgetId } from '../constants/shell';
import { getPlatformUtils } from '../platformProps/utils';
import { ShellAppLoadTimeUtils } from '../types/app-load-time';
import { WidgetConfig } from '../types/widget-config';

const SHELL_WIDGET: WidgetConfig = {
  widgetId: getShellWidgetId(),
  // TODO: Fill version if needed
  version: '',
  runtime: {},
};

type ShellPlatformProps = ReturnType<typeof getPlatformUtils> & {
  appLoadTime: ShellAppLoadTimeUtils;
};

let shellUtils: ShellPlatformProps;

export const getShellPlatformUtils = () => {
  if (shellUtils) {
    return shellUtils;
  }

  /**
   * We type cast here because if we rely on inferrence, the platform prop type provided to widget teams will
   * end up looking like`ShellPlatformProps | PlatformProps`, forcing constant type guarding for no reason.
   */
  shellUtils = getPlatformUtils(SHELL_WIDGET) as ShellPlatformProps;

  return shellUtils;
};
