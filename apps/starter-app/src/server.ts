import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
// @ts-ignore
import magicBoxServer from '@devhub/magicbox-server';

import router from './lib/router';

dotenv.config();
const { PORT = 3001 } = process.env;

const ENVIRONMENT: string = process.env.NODE_ENV || 'production';

const envModeMap: Record<string, string> = {
  development: 'development',
  integration: 'preproduction',
  stage: 'preproduction',
  demo: 'production',
  production: 'production'
}

const ROUTES = {
  WATCHDOG: '/watchdog',
  CSP_REPORT_ONLY: '/csp-report-only',
  CSP_REPORT_VIOLATION: '/csp-report-violation',
  HEALTH: '/health',
  AUTH: '/auth', // 302 to /authenticate
  LOGOUT: '/logout', // 302 to /logoutUrl
  // AUTHENTICATE: '/authenticate', // [HTML]
  VERSION: '/version',
  WIDGET_VERSION: '/version/*',
  API: '/api',
  // LOAD_TEST: '/test/load',
  // CLM_TEST: '/test/clm',
  AUTH_FORWARDER: '/auth-forwarder/:widgetId',
  IMAGES: '/images',
  // Query Parameter needed for updating favicon cache
  FAVICON: '/favicon.ico?v=2',
  OLD_FAVICON: '/favicon.ico',
  ROOT: '/',
  // TEST: '/test',
  SW: '/sw.js',
  ONE_DS_BUNDLE: '/js/bundle.js',
  EXAMPLE_BUNDLE: '/main.js',
  // TODO: Maybe need to add /* back here.
};

const options = {
  // points to common flat file
  mode: envModeMap[ENVIRONMENT],
  environment: ENVIRONMENT,
  configManagement: {
    url: `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/${ENVIRONMENT}.json`,
    refreshMs: 30 * 1000,
    phasedRelease: true,
  },
  shellBundleUrl: 'localhost:3000/bundle.js',
  server: {
    // for Integration-env only
    bathtub: true, // automatically on when mode: development
    importMapOverrides: {
      // automatically on when mode: development
      enableUI: true,
      cdnURL: '',
    },
    devtools: true, // automatically on when mode: development
    headers: {
      poweredBy: 'MagicBox',
    },
    // known routes are routes that magic box will NOT 404 on if the current route does not match a plugin
    knownRoutes: Object.values(ROUTES)
  },
};

const app = magicBoxServer(options);

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (optional)
app.set('views', path.join(__dirname, 'views'));

// Handle client routing, return all requests to the app
// @ts-ignore
// app.get('/', (_req, res) => {
//   const dataForRenderingTemplatePayload = {
//     systemJsImportMapConfig: {
//       imports: {
//         zod: "https://docucdn-a.akamaihd.net/production/1ds/libs/zod/3.23.8/lib/index.umd.js",
//         lottie: "https://docucdn-a.akamaihd.net/production/1ds/libs/lottie-web/5.11.0/build/player/lottie.js",
//         emotionStyled: "https://docucdn-a.akamaihd.net/production/1ds/libs/@emotion/styled/11.10.6/dist/emotion-styled.umd.min.js",
//         lodash: "https://docucdn-a.akamaihd.net/production/1ds/libs/lodash/4.17.21/lodash.js",
//         moment: "https://docucdn-a.akamaihd.net/production/1ds/libs/moment/2.29.4/min/moment-with-locales.js",
//         emotionReact: "https://docucdn-a.akamaihd.net/production/1ds/libs/@emotion/react/11.10.6/dist/emotion-react.umd.min.js",
//         jQuery: "https://docucdn-a.akamaihd.net/production/1ds/libs/jquery/3.5.1/dist/jquery.js",
//         RTK: "https://docucdn-a.akamaihd.net/production/1ds/libs/@reduxjs/toolkit/1.9.1/dist/redux-toolkit.umd.js",
//         React: "https://docucdn-a.akamaihd.net/production/1ds/libs/react/17.0.2/umd/react.development.js",
//         dsUi: "https://docucdn-a.akamaihd.net/production/1ds/libs/@ds/ui/7.40.0/dist/js/1ds-bundle.js",
//         optimizelySdk: "https://docucdn-a.akamaihd.net/production/1ds/libs/@optimizely/optimizely-sdk/4.9.2/dist/optimizely.browser.umd.js",
//         MomentTimezone: "https://docucdn-a.akamaihd.net/production/1ds/libs/moment-timezone/0.5.43/builds/moment-timezone-with-data.js",
//         ReactDOM: "https://docucdn-a.akamaihd.net/production/1ds/libs/react-dom/17.0.2/umd/react-dom.development.js",
//         react: "React",
//         "@emotion/react": "emotionReact",
//         ReduxjsToolkit: "RTK",
//         _: "lodash",
//         Moment: "moment",
//         _react: "React",
//         _reactDom: "ReactDOM",
//         app1: "http://localhost:8001/assets/app1.js",
//         app2: "http://localhost:8002/assets/app2.js"
//       }
//     }
//   };

//   return res.render(
//     'index.html.ejs',
//     dataForRenderingTemplatePayload,
//   );
// });

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
