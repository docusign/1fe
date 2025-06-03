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

const matchRoute = (pattern: string, path: string) => {
  let regexPattern = pattern
    .replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&') // escape everything
    .replace(/\\\*\\\*/g, '.*')              // "**" => match any depth
    .replace(/\\\*/g, '[^/]+')               // "*" => match single segment
    .replace(/:(\w+)/g, '([^/]+)');          // ":param" => capture param

  const regex = new RegExp('^' + regexPattern + '$');
  return regex.test(path);
}

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
      should404 = [...knownPaths].some(pattern => matchRoute(pattern, path));
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
