import { isEmpty, isObject, pickBy } from 'lodash';

import { ImportMap, SystemImportMap } from '../types/init';
import { WidgetConfig } from '../types/widget-config';
import { generateCDNUrl } from '../utils/url';
import {
  DYNAMIC_CONFIGS,
  getWidgetConfigValues,
  LAZY_LOADED_LIB_CONFIGS,
  WIDGET_CONFIGS,
} from '../configs/config-helpers';
import { STATE, WIDGET_URL_OVERRIDES } from '../constants/search-params';
import { readOneFEShellConfigs } from '../configs/shell-configs';
import { initializeImportMapOverridesReskin } from './import-map-ui';
import { getShellLogger } from '../utils/telemetry';

export const getQueryURLParams = (): URLSearchParams => {
  const urlParams = new URLSearchParams(window?.location?.search);
  return urlParams;
};

/**
 * Parse the widget_url_overrides query parameter
 *
 * @returns Record<widgetId, url>
 */
export const getUrlWidgetOverrides = (): Record<string, string> => {
  // const logger = getShellLogger();

  try {
    const urlParams = getQueryURLParams();

    // https://jira.corp.docusign.com/confu/display/ONEDS/URL+Overrides+in+the+1FE+Ecosystem
    // example: ?widget_url_overrides={"@ds/send":"http://localhost:8080/js/1fe-bundle.js"}
    const overrides = urlParams?.get(WIDGET_URL_OVERRIDES);

    if (overrides) {
      return JSON.parse(overrides);
    }

    // we must also additionally look for the &state={} query parameter in case the widget override
    // url was present before the browser was redirected to the auth screen
    // since the post-auth redirect is /authenticate?state={ENCODED URL QUERY PARAMS}
    // we do not want to drop/lose widget_url_overrides functionality post-auth
    const postAuthStateOverrides = urlParams?.get(STATE);

    if (!postAuthStateOverrides) return {};

    const parsedStateQueryParam = JSON.parse(postAuthStateOverrides);

    const redirectUri = parsedStateQueryParam?.redirectUri;

    if (!redirectUri) return {};

    const decodedParsedRedirectUri = decodeURIComponent(redirectUri);
    const redirectUriQuery = decodedParsedRedirectUri?.split('?')?.[1];

    if (!redirectUriQuery) return {};

    const redirectUriParams = new URLSearchParams(redirectUriQuery);

    const overrideInStateQueryParam =
      redirectUriParams?.get(WIDGET_URL_OVERRIDES);

    if (!overrideInStateQueryParam) return {};

    try {
      return JSON.parse(overrideInStateQueryParam);
    } catch (err) {
      console.error({
        message: `[IMPORT OVERRIDES][AUTH CB] The widget_url_overrides param was found in account server's state query parameter - but could not be applied.`,
        error: err,
      });
    }
  } catch (e) {
    console.warn(
      `[IMPORT OVERRIDES][AUTH CB] Unable to parse JSON in ${WIDGET_URL_OVERRIDES} param, import maps NOT overridden.`,
    );
  }

  return {};
};

export function filterImportMap(
  overrides: ImportMap,
  allowedSource: Array<string>,
) {
  /*
      Only keep sources whose hostname are in the whitelist.
      e.g sourceUrl.hostname: 127.0.0.1 should be retained. Should be agnostic of port
    */
  return pickBy(overrides, (source) => {
    try {
      const sourceUrl = new URL(source);
      return allowedSource.includes(sourceUrl.hostname);
    } catch {}

    return false;
  });
}

/**
 * Creates an import map to be applied by SystemJS when the shell initialized
 *
 * @returns importMap
 */
export const createDynamicImportMap = (): {
  importMap: SystemImportMap;
  overrides?: Record<string, string>;
} => {
  const allowedSources = DYNAMIC_CONFIGS?.importMapOverrides?.allowedSources;
  const widgetConfigs = getWidgetConfigValues(WIDGET_CONFIGS);

  const widgets = widgetConfigs.reduce((itr, e: WidgetConfig) => {
    if (e?._url) {
      return { ...itr, [e.widgetId]: e._url };
    }

    return {
      ...itr,
      [e.widgetId]: generateCDNUrl(e).toString(),
    };
  }, {});

  const importUrlOverrides = allowedSources
    ? filterImportMap(getUrlWidgetOverrides(), allowedSources)
    : getUrlWidgetOverrides();

  return {
    importMap: {
      imports: {
        // Libraries from CDNs
        ...LAZY_LOADED_LIB_CONFIGS,

        // Widgets
        ...widgets,

        // URL overrides
        ...importUrlOverrides,
      },
      scopes: {},
    },
    ...(Object.keys(importUrlOverrides).length && {
      overrides: importUrlOverrides,
    }),
  };
};

export const insertNonPersistentWidgetOverrides = (
  importMap: SystemImportMap,
) => System.addImportMap(importMap);

export function insertNewImportMap(
  importMap: System.ImportMap,
  overrideMode = false,
): void {
  const logger = getShellLogger();
  const script = document.createElement('script');
  script.type = 'systemjs-importmap';
  script.textContent = JSON.stringify(importMap);

  if (overrideMode) {
    script.setAttribute('data-qa', 'import-map-overrides');
  }

  script.onerror = (e) => {
    logger.error({
      message: '[IMPORT MAP OVERRIDE ERROR]',
      error: e,
    });
  };

  document.head.appendChild(script);
}

export const insertPersistentWidgetOverrides = (
  overrides: Record<string, string> = {},
  importMap: SystemImportMap,
) => {
  insertNewImportMap(importMap);

  // const { IS_PROD, FEATURE_FLAGS, ENVIRONMENT } = getEnvironmentConfigs();

  const IS_PROD = readOneFEShellConfigs().mode === 'production';
  if (!IS_PROD) {
    initializeImportMapOverridesReskin();

    // TODO (POST_MVP): Uncomment and add dev tools later
    // try {
    //   if (
    //     FEATURE_FLAGS.enable1feDevtool &&
    //     isIntegrationEnvironment(ENVIRONMENT)
    //   ) {
    //     hideImportMapOverrideButton();
    //   }
    // } catch (e) {}
  }

  if (overrides && Object.keys(overrides).length > 0) {
    if (!window?.importMapOverrides) {
      console.warn(
        '[1FE][IMPORT MAP OVERRIDES] Overrides have not been applied since the Shell booted before the import-map-overrides. Please reload the page and ensure Cache is not disabled.',
      );
    }

    Object.entries(overrides).forEach(([id, url]) => {
      // https://github.com/single-spa/import-map-overrides/blob/HEAD/docs/api.md
      window?.importMapOverrides?.addOverride?.(id, url);
      console.log(`[ImportMapOverrides] ${id} url overridden with ${url}`);
    });
  }

  const importMapOverrides = window?.importMapOverrides?.getOverrideMap();

  // reinsert the override map, to force systemjs to reprocess it.
  if (isObject(importMapOverrides) && !isEmpty(importMapOverrides)) {
    insertNewImportMap(importMapOverrides, true);
  }

  // @ts-expect-error prepareImport is not on the delcared type for System
  System.prepareImport(true).then(() => {
    console.log('[ImportMapOverrides] Dynamic map loaded');
  });
};
