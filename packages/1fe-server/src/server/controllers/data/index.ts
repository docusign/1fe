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
import { readOneFEConfigs } from '../../utils/one-fe-configs';
import { getRequestHost } from '../../utils/request-helpers';
import { getWidgetConfigsForIndexHtml } from './widget-config';
import { STATIC_ASSETS } from '../../constants';

export const dataForRenderingTemplate = async (req: Request) => {
  // TODO:[1FE consumption] Will enableRuntimeConfigOverrides flag be promoted to production? May need to update this
  const widgetConfigs = await getWidgetConfigsForIndexHtml(req);
  const activePluginConfig = req.plugin;

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

    // @TODO: This part below is unacceptable - 1fe should not
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
    convertServerWidgetConfigToShellWidgetConfig(widgetConfigs);

  // const activeAutomatedTestFramework =
  //   req.query.automated_test_framework || null;

  const shellBundleUrl = readOneFEConfigs().shellBundleUrl;

  return {
    isProduction: readOneFEConfigs().mode === 'production',
    hideImportMapOverrideElement:
      readOneFEConfigs().dynamicConfigs?.importMapOverrides?.enableUI === false,
    widgetConfigs: slimWidgetConfigsForShell,
    pluginConfigs: getPluginConfigs(),
    dynamicConfigs: convertServerDynamicConfigToShellDynamicConfig(
      readOneFEConfigs().dynamicConfigs,
    ),
    envConfigs: {
      environment: readOneFEConfigs().environment,
      mode: readOneFEConfigs().mode,
    },
    criticalLibraryConfigUrls: criticalLibs,
    lazyLoadedLibsConfig: lazyLoadedLibs,
    packages: {},
    preloadableFetchAPIURLs,
    preloadableStaticAssetURLs,
    metaTags: getMetaTagStringsFromWidgetRuntimeConfig(
      widgetConfigs,
      activePluginConfig as PluginConfig,
    ),
    pageTitle: readOneFEConfigs().orgName,
    baseHref: `${getRequestHost(req)}/`,
    cspNonceGuid: req.cspNonceGuid,
    systemJsImportMapConfig: {
      imports: {
        ...preloadedLibs,
        ...missingBareSpecifiersMap,
      },
    },
    favicon: STATIC_ASSETS.FAVICON,
    shellBundleUrl,
  };
};
