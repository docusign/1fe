import React, { useEffect } from 'react';
import {
  RouteObject,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom';

import { readOneFEShellConfigs } from '../configs/shell-configs';
import {
  ENVIRONMENT_CONFIG,
  getWidgetConfigValues,
  PLUGIN_CONFIGS,
} from '../configs/config-helpers';
import { RouteWrapper } from './RouteWrapper';
import { basePathname } from '../utils/url';
import PluginLoader from './PluginLoader';
import { getGenericError } from './GenericError';

// equivelent of react-router's <Redirect /> component
const RedirectComponent = ({ to }: { to: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, []);

  return null;
};

const determineBaseRoute = (): RouteObject[] => {
  const isProd = ENVIRONMENT_CONFIG.isProduction;
  const defaultRoute =
    readOneFEShellConfigs()?.routes?.defaultRoute || '/playground';
  if (isProd) {
    return [
      {
        path: '/',
        element: <RedirectComponent to={defaultRoute} />,
      },
    ];
  }

  // When in integration, we want to allow the user to navigate to the playground
  // Also the base route should be the playground
  return [
    {
      path: '/',
      element: <RedirectComponent to='/playground' />,
    },
  ];
};

const getPluginRoutes = (): RouteObject[] => {
  const getError =
    readOneFEShellConfigs()?.components?.getError || getGenericError;

  return getWidgetConfigValues(PLUGIN_CONFIGS).map((plugin): RouteObject => {
    return {
      path: `${plugin.route}/*`,
      element: (
        <RouteWrapper plugin={plugin}>
          <PluginLoader plugin={plugin} />
        </RouteWrapper>
      ),
      errorElement: getError(),
    };
  });
};

let router: ReturnType<typeof createBrowserRouter>;

export const getRouter = () => {
  if (router) {
    return router;
  }

  const getError =
    readOneFEShellConfigs()?.components?.getError || getGenericError;

  const routerConfig: RouteObject[] = [
    ...determineBaseRoute(),
    ...getPluginRoutes(),
    {
      path: '*',
      element: getError({
        type: 'notFound',
      }),
    },
  ];

  router = createBrowserRouter(routerConfig, {
    basename: basePathname(),
  });

  return router;
};
