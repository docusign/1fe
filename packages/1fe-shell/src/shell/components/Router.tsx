import React, { useEffect } from 'react';
import {
  RouteObject,
  createBrowserRouter,
  useNavigate,
} from 'react-router-dom';

// import { CatchAll } from './CatchAll';
import { Error } from './Error';
import { readMagicBoxShellConfigs } from '../configs/shell-configs';
import { getWidgetConfigValues, PLUGIN_CONFIGS } from '../configs/config-helpers';
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
  const isProd = readMagicBoxShellConfigs().mode === 'production';
  if (isProd) {
    return [
      {
        path: '/',
        // TODO: configure default route
        element: <RedirectComponent to='/app1' />,
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
          // TODO: configure default route
          element: <RedirectComponent to='/app1' />,
        },
        {
          path: '/bathtub',
          element: <RedirectComponent to='/bathtub' />,
        },
      ];
};

const pluginRoutes = getWidgetConfigValues(PLUGIN_CONFIGS).map(
  // TODO: Fix type
  (plugin: any): RouteObject => {
    return {
      path: `${plugin.route}/*`,
      element: (
        <RouteWrapper plugin={plugin}>
          <PluginLoader plugin={plugin} />
        </RouteWrapper>
      ),
      errorElement: <Error />,
    };
  },
);

let router: ReturnType<typeof createBrowserRouter>;

export const getRouter = () => {
  if (router) {
    return router;
  }
  
  const routerConfig: RouteObject[] = [
    ...determineBaseRoute(),
    ...pluginRoutes,
    {
      path: '*',
      element: <Error type='notFound' />,
    },
  ];

  router = createBrowserRouter(routerConfig, {
    basename: basePathname(),
  });

  return router;
};
