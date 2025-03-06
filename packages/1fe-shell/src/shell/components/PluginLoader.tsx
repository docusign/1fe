import React, { useEffect } from 'react';
// import { getShellPlatformUtils } from '../utils/shell-platform-utils';

import { Error } from './Error';
import { PluginConfig } from '../types/widget-config';
import { WIDGET_CONFIGS } from '../configs/config-helpers';
import { getShellPlatformUtils } from '../utils/shell-platform-utils';
import RequireAuth from './RequireAuth';
import { getShellWidgetId } from '../constants/shell';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';

interface PluginLoaderInterface {
  plugin: PluginConfig;
}

/**
 * Direct container of a plugin.
 *
 * 1DS is a multi page application (MPA), meaning this should NEVER re-render or unmount under any circumstance.
 */
const PluginLoader = ({
  plugin,
}: PluginLoaderInterface): React.ReactElement => {
  // usePublishUtilHistoryOnIntegration();
  // useCheckPluginRenderCount(plugin);

  useEffect(() => {
    getShellPlatformUtils().appLoadTime.markEnd(getShellWidgetId());
  }, []);

  const parsedWidget = WIDGET_CONFIGS.get(plugin.widgetId);
  if (!parsedWidget?.widgetId) {
    const getError = readMagicBoxShellConfigs().components.getError;
    return getError({
      plugin,
      message: 'No such experience found'
    })
  }

  // TODO: @Quinn-Relyea When `widgets.Frame` is introduced, let's refactor this to consume that API
  // and also the above Error can be provided as the desired fallback.
  const Plugin = getShellPlatformUtils().widgets.get(parsedWidget?.widgetId);

  return (
    <RequireAuth pluginConfig={plugin}>
      <Plugin />
    </RequireAuth>
  );
};

export default PluginLoader;
