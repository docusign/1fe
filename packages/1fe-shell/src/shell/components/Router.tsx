import React, { useEffect } from 'react';
import {
  RouteObject,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom';

import { readOneFEShellConfigs } from '../configs/shell-configs';
import {
  getWidgetConfigValues,
  PLUGIN_CONFIGS,
} from '../configs/config-helpers';
import { RouteWrapper } from './RouteWrapper';
import { basePathname } from '../utils/url';
import PluginLoader from './PluginLoader';

// equivelent of react-router's <Redirect /> component
const RedirectComponent = ({ to }: { to: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, []);

  return null;
};

const determineBaseRoute = (): RouteObject[] => {
  const isProd = readOneFEShellConfigs().mode === 'production';
  const defaultRoute =
    readOneFEShellConfigs()?.routes?.defaultRoute || '/bathtub';
  if (isProd) {
    return [
      {
        path: '/',
        element: <RedirectComponent to={defaultRoute} />,
      },
    ];
  }

  // When in integration, we want to allow the user to navigate to the bathtub
  // Also the base route should be the bathtub
  // When in higher environments, we want to redirect the user to the send page
  // and all routes to bathtub should be redirected to send
  return [
    {
      path: '/',
      element: <RedirectComponent to='/bathtub' />,
    },
  ];
};

const getPluginRoutes = () => {
  const getError = readOneFEShellConfigs().components.getError;

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

  const getError = readOneFEShellConfigs().components.getError;

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
