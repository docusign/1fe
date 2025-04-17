import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import oneFEServer, { OneFEServerOptions } from '@devhub/1fe-server';
import favicon from 'serve-favicon';

import router from './lib/router';
import { enforcedDefaultCsp, reportOnlyDefaultCsp } from './csp-configs';
import errorMiddleware from './server/middlewares/error.middleware';

dotenv.config();
const { PORT = 3001 } = process.env;

const ENVIRONMENT: string = process.env.NODE_ENV || 'development';

const shellBundleUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002/public/js/bundle.js'
    : 'https://1fe-demo-hbb2dxgbgxg2dac6.centralus-01.azurewebsites.net/js/bundle.js';

const envModeMap: Record<string, OneFEServerOptions['mode']> = {
  development: 'development',
  integration: 'preproduction',
  production: 'production',
};

const ROUTES = {
  WATCHDOG: '/watchdog',
  CSP_REPORT_ONLY: '/csp-report-only',
  CSP_REPORT_VIOLATION: '/csp-report-violation',
  HEALTH: '/health',
  VERSION: '/version',
  WIDGET_VERSION: '/version/*',
  API: '/api',
  IMAGES: '/images',
  // Query Parameter needed for updating favicon cache
  FAVICON: '/favicon.ico',
  ROOT: '/',
  SW: '/sw.js',
  ONE_DS_BUNDLE: '/js/bundle.js',
  EXAMPLE_BUNDLE: '/main.js',
};

const options = {
  // points to common flat file
  mode: envModeMap[ENVIRONMENT],
  environment: ENVIRONMENT,
  orgName: '1FE Starter App',
  configManagement: {
    getDynamicConfigs: async () => {
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/${ENVIRONMENT}.json`,
      );

      if (!response.ok) {
        throw new Error('Get dynamic configurations failed');
      }

      return await response.json();
    },
    url: `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/${ENVIRONMENT}.json`,
    refreshMs: 30 * 1000,
  },
  shellBundleUrl,
  server: {
    // for Integration-env only
    bathtub: true, // automatically on when mode: development
    // known routes are routes that 1fe will NOT 404 on if the current route does not match a plugin
    knownRoutes: Object.values(ROUTES),
  },
  csp: {
    defaultCSP: {
      enforced: enforcedDefaultCsp[ENVIRONMENT],
      reportOnly: reportOnlyDefaultCsp[ENVIRONMENT],
    },
  },
};

const app = oneFEServer(options);

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// @ts-ignore
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

// Serve API requests from the router
app.use('/api', router);

app.use(errorMiddleware);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (optional)
// app.set('views', path.join(__dirname, 'server/views'));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
