// @ts-ignore
import renderMagicBoxShell from '@devhub/1fe-shell';
import React from 'react';

import { Loader } from './components/Loader';
import { Error } from './components/Error';
import { shellLogger } from './logger';

const setup = () => {
  const ENVIRONMENT: string = process.env.NODE_ENV || 'integration';

  const envModeMap: Record<string, string> = {
    development: 'development',
    integration: 'preproduction',
    production: 'production',
  };

  // TODO: Just read from server configs put on DOM
  renderMagicBoxShell({
    mode: envModeMap[ENVIRONMENT],
    environment: ENVIRONMENT,
    utils: {},
    auth: {
      isAuthedCallback: (widgetId: string): boolean => {
        console.log(widgetId, ' is authenticated.');
        return true;
      },
      unauthedCallback: (widgetId: string) => {
        console.log(widgetId, ' is not authenticated.');         
      }
    },
    shellLogger: {
      ...shellLogger,
      logPlatformUtilUsage: true,
      redactSensitiveData: true,
    },
    components: {
      getLoader: () => <Loader />,
      // TODO: No any
      getError: (props: any) => <Error {...props} />
    }
  });
};

setup();
