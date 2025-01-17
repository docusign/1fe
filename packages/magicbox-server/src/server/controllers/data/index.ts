import { Request } from 'express';
import { getCachedWidgetConfigs } from '../../utils';

// TODO:
// import packageJson from '../../../package.json';
// import {
//   APP_NAME,
//   ENVIRONMENT,
//   HTTP_404_NOT_FOUND_URL,
//   IS_CDN_ENVIRONMENT,
//   IS_DEVELOPMENT,
//   IS_MINIKUBE,
//   IS_PROD,
//   SERVER_BUILD_NUMBER,
//   TELEMETRY_INSTRUMENTATION_KEY,
//   getCriticalLibs,
//   getHostedOrSimulatedEnvironment,
//   getLazyLoadedLibs,
//   getPreloadedLibs,
//   missingBareSpecifiersMap,
// } from '../../configs';
// import {
//   CAUSE,
//   DOCUSIGN_TITLE,
//   SERVER_ERROR_ROUTE,
//   SESSION_STORAGE_KEY_PREFIXES,
//   STATIC_ASSETS,
//   WIDGET_PATH,
//   X_FORWARDED_FOR,
// } from '../../constants';
// import { ACTIVE_AUTOMATED_TEST_FRAMEWORK } from '../../constants/cookie-names';
// import { EnvConfig, IndexDataType } from '../../types';

// import { PluginConfig } from '../../isomorphic/types/widgetConfigs.types';
// import { getCachedWidgetConfigs } from '../../utils/dynamic-config';
// import {
//   getClientFeatureFlags,
//   getServerFeatureFlags,
// } from '../../utils/feature-flag-helpers';
// import { isInternalPluginCodeQueryStringProvided } from '../../utils/internal-plugin-gating';
// import { getMetaTagStringsFromWidgetRuntimeConfig } from '../../utils/meta-tags-helpers';
// import { getRequestHost } from '../../utils/request-helpers';

// import { getCDNUrlForPath } from '../../1ds-shell/constants';
// import {
//   getPluginPreloadApiUrls,
//   getPluginPreloadAssetUrls,
// } from '../../isomorphic/preload-helpers';
// import { generateShellCDNUrl } from '../../isomorphic/url-helpers';
// import {
//   setErrorSpanStatus,
//   startActiveSpanWrapper,
// } from '../../utils/open-telemetry-helpers';
// import { getLivePackageVersions } from './get-live-package-versions';
// import { getPluginConfigs } from './plugin-config';
// import {
//   convertServerWidgetConfigToShellWidgetConfig,
//   getWidgetConfigsForIndexHtml,
// } from './widget-config';

// export const dataForRenderingTemplate = async (req: Request) => {
//   return startActiveSpanWrapper('dataForRenderingTemplate', async (span) => {
//     try {
//       const activeAutomatedTestFramework =
//         req.query.automated_test_framework || null;

//       const auth = req.auth ? JSON.stringify(req.auth) : undefined;

//       const activePluginConfig = req.plugin;
//       const { cspNonceGuid } = req;

//       const envConfig: EnvConfig = {
//         // ENVIRONMENT development remaps to integration,
//         // but IS_DEVELOPMENT indicated when running locally
//         ENVIRONMENT: getHostedOrSimulatedEnvironment(),
//         IS_DEVELOPMENT,
//         IS_PROD,
//         IS_CDN_ENVIRONMENT: IS_CDN_ENVIRONMENT(),
//         SERVER_BUILD_NUMBER,
//         VERSION: packageJson.version,
//         TELEMETRY_INSTRUMENTATION_KEY: TELEMETRY_INSTRUMENTATION_KEY(),
//         APP_NAME,
//         FEATURE_FLAGS: getClientFeatureFlags(req),
//         IP_ADDRESS: req.headers[X_FORWARDED_FOR] as string,
//         HTTP_404_NOT_FOUND_URL: HTTP_404_NOT_FOUND_URL(),
//         IS_AUTOMATION_RUN: req?.isAutomationRun,
//       };

//       const {
//         // Determine if an internal plugin should be included in the plugin config list
//         // Uses INTERNAL_PLUGIN_CODE as it was the original value for the widget starter kit
//         enableInternalPluginGating,
//         enableCriticalLibRetry,
//         enableImportMapOverridesFork,
//         enableRuntimeConfigOverrides,
//       } = getServerFeatureFlags(req);

//       const shouldLoadInternalWidget = enableInternalPluginGating
//         ? isInternalPluginCodeQueryStringProvided(req)
//         : true;

//       const widgetConfigs = enableRuntimeConfigOverrides
//         ? await getWidgetConfigsForIndexHtml(req)
//         : getCachedWidgetConfigs();

//       const pluginConfigs = getPluginConfigs(shouldLoadInternalWidget);

//       const preloadableFetchAPIURLs = getPluginPreloadApiUrls({
//         widgetConfigs,
//         pluginId: activePluginConfig?.widgetId,
//       });

//       const preloadedLibs = getPreloadedLibs();
//       const lazyLoadedLibs = getLazyLoadedLibs();
//       const criticalLibs = getCriticalLibs({
//         enableImportMapOverridesFork: enableImportMapOverridesFork ?? false,
//       });

//       const pluginPreloadAssetUrls =
//         getPluginPreloadAssetUrls({
//           envConfig,
//           widgetConfigs,
//           pluginId: activePluginConfig?.widgetId,
//         }) ?? [];

//       const preloadableStaticAssetURLs = [
//         ...pluginPreloadAssetUrls,
//         ...Object.values(preloadedLibs),
//         ...Object.values(criticalLibs),
//       ];

//       const shellCdnUrl = IS_MINIKUBE
//         ? new URL(`https://${req.hostname}/js/bundle.js`)
//         : generateShellCDNUrl(ENVIRONMENT, SERVER_BUILD_NUMBER);

//       const iosIcon = getCDNUrlForPath(
//         'images/logo_add_to_home_screen.png',
//         SERVER_BUILD_NUMBER,
//         ENVIRONMENT,
//       );

//       if (!widgetConfigs) {
//         const message = '[1DS-App] Config not found: widgetConfig';
//         setErrorSpanStatus(span, new Error(message));
//       }

//       if (!pluginConfigs.length) {
//         const message = '[1DS-App] Config not found: pluginConfig';
//         setErrorSpanStatus(span, new Error(message));
//       }

//       // trim down excessive data from widget config before sending to the Shell
//       // this helps keep the HTML payload size down for the Shell
//       const slimWidgetConfigsForShell =
//         convertServerWidgetConfigToShellWidgetConfig(widgetConfigs);

//       const dataForRendering = {
//         widgetConfigs: slimWidgetConfigsForShell,
//         pluginConfigs,
//         systemJsImportMapConfig: {
//           imports: { ...preloadedLibs, ...missingBareSpecifiersMap },
//         },
//         criticalLibraryConfigUrls: criticalLibs,
//         lazyLoadedLibsConfig: lazyLoadedLibs,
//         packages: getLivePackageVersions(),
//         shellCdnUrl,
//         iosIcon,
//         envConfig,
//         baseHref: `${getRequestHost(req)}/`,
//         preloadableStaticAssetURLs,
//         preloadableFetchAPIURLs,
//         cspNonceGuid,
//         widgetId: activePluginConfig?.widgetId,
//         activePluginConfig,
//         hideImportMapOverrideElement:
//           activeAutomatedTestFramework ||
//           req.cookies[ACTIVE_AUTOMATED_TEST_FRAMEWORK],
//         auth,
//         authInfoSessionStorageKey: `${SESSION_STORAGE_KEY_PREFIXES.authInfo}${activePluginConfig?.widgetId}`,
//         metaTags: getMetaTagStringsFromWidgetRuntimeConfig(
//           widgetConfigs,
//           activePluginConfig as PluginConfig,
//         ),
//         favicon: STATIC_ASSETS.FAVICON,
//         pageTitle: DOCUSIGN_TITLE,
//         enableCriticalLibRetry,
//         serverErrorRoute: SERVER_ERROR_ROUTE,
//         cause: CAUSE,
//         widgetPath: WIDGET_PATH,
//       } satisfies IndexDataType;

//       return dataForRendering;
//     } catch (error) {
//       setErrorSpanStatus(span, error);
//     } finally {
//       span.end();
//     }
//   });
// };

// export * from './plugin-config';
// export * from './widget-config';

export const dataForRenderingTemplate = async (_: Request) => ({
  widgetConfigs: getCachedWidgetConfigs(),
  pluginConfigs: {},
  packages: {},
  systemJsImportMapConfig: {
    imports: {
      zod: "https://docucdn-a.akamaihd.net/production/1ds/libs/zod/3.23.8/lib/index.umd.js",
      lottie: "https://docucdn-a.akamaihd.net/production/1ds/libs/lottie-web/5.11.0/build/player/lottie.js",
      emotionStyled: "https://docucdn-a.akamaihd.net/production/1ds/libs/@emotion/styled/11.10.6/dist/emotion-styled.umd.min.js",
      lodash: "https://docucdn-a.akamaihd.net/production/1ds/libs/lodash/4.17.21/lodash.js",
      moment: "https://docucdn-a.akamaihd.net/production/1ds/libs/moment/2.29.4/min/moment-with-locales.js",
      emotionReact: "https://docucdn-a.akamaihd.net/production/1ds/libs/@emotion/react/11.10.6/dist/emotion-react.umd.min.js",
      jQuery: "https://docucdn-a.akamaihd.net/production/1ds/libs/jquery/3.5.1/dist/jquery.js",
      RTK: "https://docucdn-a.akamaihd.net/production/1ds/libs/@reduxjs/toolkit/1.9.1/dist/redux-toolkit.umd.js",
      React: "https://docucdn-a.akamaihd.net/production/1ds/libs/react/17.0.2/umd/react.development.js",
      dsUi: "https://docucdn-a.akamaihd.net/production/1ds/libs/@ds/ui/7.40.0/dist/js/1ds-bundle.js",
      optimizelySdk: "https://docucdn-a.akamaihd.net/production/1ds/libs/@optimizely/optimizely-sdk/4.9.2/dist/optimizely.browser.umd.js",
      MomentTimezone: "https://docucdn-a.akamaihd.net/production/1ds/libs/moment-timezone/0.5.43/builds/moment-timezone-with-data.js",
      ReactDOM: "https://docucdn-a.akamaihd.net/production/1ds/libs/react-dom/17.0.2/umd/react-dom.development.js",
      react: "React",
      "@emotion/react": "emotionReact",
      ReduxjsToolkit: "RTK",
      _: "lodash",
      Moment: "moment",
      _react: "React",
      _reactDom: "ReactDOM",
      app1: "http://localhost:8001/assets/app1.js",
      app2: "http://localhost:8002/assets/app2.js"
    }
  }
});
