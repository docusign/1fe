import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import combinedMiddleware from './middlewares';
import HealthRoute from './routes/health.route';
import VersionRoute from './routes/version.route';
import IndexRoute from './routes/index.route';
import { RoutesInterface } from './types';
import { pollDynamicConfig } from './utils/config-poller';

/*
    TODO:
    - Strongly type options
*/

const initializeRoutes = (app: express.Application) => {
  const routes: RoutesInterface[] = [new HealthRoute(), new VersionRoute()];

  routes.forEach((route) => {
    app.use('/', route.router);
  });

  app.use('/error', (req, res, next) => {
    const error = new Error(
      `[server] Error Page Triggered - source: ${req.query['cause']}, widgetPath: ${req.query['widget_path']}`,
    );
    next(error);
  });

  // indexRoute is the fallback route
  app.use('/', new IndexRoute().router);
};

export const magicBoxServer = (options: any) => {
  const app = express();
  app.use(cookieParser());
  app.use(combinedMiddleware);

  app.use(express.static(path.join(process.cwd(), 'dist', 'public')));
  initializeRoutes(app);

  pollDynamicConfig(options);

  return app;
};
