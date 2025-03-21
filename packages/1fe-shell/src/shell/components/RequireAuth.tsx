import { ReactNode, useEffect, useState } from 'react';

import { readOneFEShellConfigs } from '../configs/shell-configs';
import { PluginConfig } from '../types/widget-config';

interface AuthenticateInterface {
  pluginConfig: PluginConfig | undefined;
  children: ReactNode;
}

const RequireAuth = ({ pluginConfig, children }: AuthenticateInterface) => {
  const [shouldShowChildren, setShouldShowChildren] = useState<boolean>(false);

  useEffect(() => {
    if (pluginConfig === undefined) {
      return;
    }

    if (pluginConfig.auth?.authenticationType === 'required') {
      const shouldShowChildren = readOneFEShellConfigs()?.auth?.isAuthedCallback(
        pluginConfig.widgetId,
      ) || false;

      if (!shouldShowChildren) {
        readOneFEShellConfigs()?.auth?.unauthedCallback(pluginConfig.widgetId);
      }

      setShouldShowChildren(shouldShowChildren);
    } else {
      setShouldShowChildren(true);
    }
  }, [pluginConfig?.widgetId]);

  return <>{shouldShowChildren ? children : null}</>;
};

export default RequireAuth;
