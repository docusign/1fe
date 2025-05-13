import renderOneFEShell, {
  OneFEMode,
  OneFEErrorComponentProps,
} from '@1fe/shell';
import React from 'react';

import { Loader } from './components/Loader';
import { Error } from './components/Error';
import { shellLogger } from './logger';

const setup = () => {
  // TODO[1fe]: Just read from server configs put on DOM
  // TODO[1fe]: Review the types here (components)
  renderOneFEShell({
    utils: {
      initializeLogger: (widgetId: string) => ({
        logger: {
          log: (message: string) => {
            console.log(widgetId, message);
          },
          error: (message: string) => {
            console.error(widgetId, message);
          },
        },
      }),
    },
    auth: {
      isAuthedCallback: (widgetId: string): boolean => {
        console.log(widgetId, ' is authenticated.');
        return false;
      },
      unauthedCallback: (widgetId: string) => {
        console.log(widgetId, ' is not authenticated.');
      },
    },
    shellLogger: {
      ...shellLogger,
      logPlatformUtilUsage: true,
      redactSensitiveData: true,
    },
    components: {
      getLoader: () => <Loader />,
      getError: (props?: OneFEErrorComponentProps) => <Error {...props} />,
    },
    routes: {
      defaultRoute: '/app1',
    },
  });
};

setup();
