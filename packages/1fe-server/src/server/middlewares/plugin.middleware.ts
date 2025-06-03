import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { BASE_KNOWN_ROUTES, PLUGIN_DISABLED, PLUGIN_ID } from '../constants';
import {
  getPlugin,
  getPluginBaselineUrl,
  getPluginById,
} from '../utils/plugin-helpers';
import { PluginConfig } from '../types';
import { readOneFEConfigs } from '../utils/one-fe-configs';

async function ensureURLPattern() {
  // @ts-expect-error URLPattern will not exist on globalThis in Node.js
  if (!globalThis.URLPattern) {
    await import('urlpattern-polyfill');
  }
}

/*
TODO:
- [1FE consumption] New middleware for updateOtelContextWithWidgetId
- [1FE consumption] New middleware for getPluginFromAuthCallback
*/

const getKnownPaths = (): Set<string> => {
  const knownRoutes = readOneFEConfigs()?.server?.knownRoutes || [];
  // return new Set(knownRoutes);
  const baseKnownRoutes = Object.values(BASE_KNOWN_ROUTES);
  return new Set([...knownRoutes, ...baseKnownRoutes]);
};

const matchAnyRoute = async (
  knownPaths: Set<string>,
  fullUrl: string,
): Promise<boolean> => {
  await ensureURLPattern();

  return [...knownPaths].some((pattern) => {
    const urlPattern = new URLPattern({ pathname: pattern });
    return urlPattern.test(fullUrl);
  });
};

const pluginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const path = req.path ?? '';
    // const topLevelPath = `/${path.split('/')[1]}`;
    // const topTwoLevelsPath = `/${path.split('/').slice(1, 3).join('/')}`;

    // for /auth/logout, /test/load, etc.
    // For OSS, combined KNOWN_PATHS and IGNORED_PATHS
    // TODO: [1FE Consumption]. Going to comment this out for now. Could cause unwanted side effects
    // const topTwoLevelsPath = `/${path.split('/').slice(1, 3).join('/')}`;
    const knownPaths = getKnownPaths();

    let plugin: PluginConfig | undefined;
    let should404 = false;
    let pluginBaselineUrl: string | undefined;

    if (req.query) {
      // look for plugin_id query param
      if (!plugin && !isEmpty(req.query[PLUGIN_ID])) {
        plugin = await getPluginById(`${req.query[PLUGIN_ID]}`);
      }
    }

    // fallback to use route to find plugin
    if (!plugin) {
      plugin = await getPlugin(path);
    }

    if (plugin) {
      req.plugin = plugin;

      pluginBaselineUrl = getPluginBaselineUrl(plugin);

      // strict check for falsy to rule out undefined
      if (plugin.enabled === false) {
        // if plugin is disabled, route to baseline if available, otherwise 404
        if (pluginBaselineUrl?.length) {
          try {
            const baselineUrl = new URL(pluginBaselineUrl);

            // plugin should not redirect to 1FE if `plugin_disabled=1`
            baselineUrl.searchParams.append(PLUGIN_DISABLED, '1');
            res.redirect(baselineUrl.href);
            return next();
          } catch (err) {
            should404 = true;
          }
        }

        should404 = true;
      }
    } else {
      // Check if any known paths match the route
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      should404 = !(await matchAnyRoute(knownPaths, fullUrl));
    }

    if (should404) {
      res.status(404);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

export default pluginMiddleware;
