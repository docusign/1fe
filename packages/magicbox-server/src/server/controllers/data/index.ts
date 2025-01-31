import { Request } from 'express';
import {
  convertServerDynamicConfigToShellDynamicConfig,
  convertServerWidgetConfigToShellWidgetConfig,
  getPluginConfigs,
} from '../../utils';
import {
  getPluginPreloadApiUrls,
  getPluginPreloadAssetUrls,
} from '../../utils/preload';
import {
  getCriticalLibs,
  getLazyLoadedLibs,
  getPreloadedLibs,
} from '../../utils/libs';
import { getMetaTagStringsFromWidgetRuntimeConfig } from '../../utils/meta-tags';
import { PluginConfig } from '../../types';
import { getCachedWidgetConfigs } from '../../utils/widget-config';
import { readMagicBoxConfigs } from '../../utils/magicbox-configs';

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

// TODO: Strongly type request
export const dataForRenderingTemplate = async (req: Request) => {
  // TODO:[1DS consumption] Will enableRuntimeConfigOverrides flag be promoted to production? May need to update this
  const widgetConfigs = getCachedWidgetConfigs();
  const activePluginConfig = (req as any).plugin;

  const preloadableFetchAPIURLs = getPluginPreloadApiUrls({
    widgetConfigs,
    pluginId: activePluginConfig?.widgetId,
  });

  // These are needed bare specifiers that are missing from externalConfigLibraryMapper
  // Without shellLibSpecifierMap, we get this error: https://github.com/systemjs/systemjs/blob/main/docs/errors.md#8
  const missingBareSpecifiersMap = {
    // emotion/react compatibility
    react: 'React',

    // emotion/styled compatibility
    '@emotion/react': 'emotionReact',

    // ReduxjsToolkit got renamed to RTK
    ReduxjsToolkit: 'RTK',
    _: 'lodash',

    Moment: 'moment',

    // @TODO: This part below is unacceptable - 1ds should not
    // know about a particular widget or plugin
    // @ds/prepare hardcoded requirements
    _react: 'React',
    _reactDom: 'ReactDOM',

    // TODO: (@mason-chinkin) uncomment below when externalizing react router
    // required for externalizing react-router-dom
    // 'react-router': 'ReactRouter',
    // '@remix-run/router': 'RemixRouter',
  } as const;

  const preloadedLibs = getPreloadedLibs();
  const lazyLoadedLibs = getLazyLoadedLibs();
  const criticalLibs = getCriticalLibs();

  const pluginPreloadAssetUrls =
    getPluginPreloadAssetUrls({
      widgetConfigs,
      pluginId: activePluginConfig?.widgetId,
    }) ?? [];

  const preloadableStaticAssetURLs = [
    ...pluginPreloadAssetUrls,
    ...Object.values(preloadedLibs),
    ...Object.values(criticalLibs),
  ];

  const slimWidgetConfigsForShell =
    convertServerWidgetConfigToShellWidgetConfig(getCachedWidgetConfigs());

  return {
    widgetConfigs: slimWidgetConfigsForShell,
    pluginConfigs: getPluginConfigs(),
    dynamicConfigs: convertServerDynamicConfigToShellDynamicConfig(
      readMagicBoxConfigs().dynamicConfigs,
    ),
    criticalLibraryConfigUrls: criticalLibs,
    lazyLoadedLibsConfig: lazyLoadedLibs,
    packages: {},
    preloadableFetchAPIURLs,
    preloadableStaticAssetURLs,
    metaTags: getMetaTagStringsFromWidgetRuntimeConfig(
      widgetConfigs,
      activePluginConfig as PluginConfig,
    ),
    systemJsImportMapConfig: {
      imports: {
        ...preloadedLibs,
        ...missingBareSpecifiersMap,
      },
    },
  };
};
