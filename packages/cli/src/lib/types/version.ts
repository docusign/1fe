// import { HostedEnvironment } from '@1ds/helpers/types';
import { Widget } from '../config/config.types';

export const externalLibIds = {
  lodash: 'lodash',
  momentTimezone: 'moment-timezone',
  reactDom: 'react-dom',
  emotionStyled: '@emotion/styled',
  moment: 'moment',
  dsUi: '@ds/ui',
  jquery: 'jquery',
  react: 'react',
  reactRouterDom: 'react-router-dom',
  emotionReact: '@emotion/react',
  reduxToolkit: '@reduxjs/toolkit',
  lottieWeb: 'lottie-web',
  optimizely: '@optimizely/optimizely-sdk',
} as const;

export type ExternalLibIds =
  (typeof externalLibIds)[keyof typeof externalLibIds];

export const installedLibIds = {
  cli: '@1ds/cli',
  playwright: '@playwright/test',
  browserslistConfig: '@1ds/browserslist-config',
  tsconfig: '@1ds/tsconfig',
  utils: '@1ds/utils',
  shell: '@1ds/shell',
  webpackLocalizationPlugin: '@1ds/webpack-localization-plugin',
  typescript: 'typescript',
} as const;

/**
 * NOTE: The value MUST ALWAYS MATCH WHAT is described here
 * https://github.docusignhq.com/Core/1ds-app/blob/5a67f27f1a9248ef9ec7b828f2c06cf3c368e38b/src/1ds-shell/utils/system-helpers.ts#L16
 * {@see CONTEXT_IMPORT_NAME}
 */
export const ONE_DS_CONTEXT_EXTERNAL_SYMBOL = `1dsContext`;
/**
 * NOTE: Don't change this value unless you know what you're doing.
 * `window` makes sure that webpack will not try to resolve this as a module. and $$1dsContext is the name of the global variable that is used by the plugin
 */
export const ONE_DS_CONTEXT_LEGACY_POLYFILL_SYMBOL = `window $$1dsContextPolyfill`;

export type InstalledLibIds =
  (typeof installedLibIds)[keyof typeof installedLibIds];

// type for object found at https://apps.docusign.com/version
// this is the live source of truth for the versioning of utils and externalized libraries
export type LiveVersions = {
  environment: string;
  version: string;
  nodeVersion: string;
  buildNumber: string;
  branch: string;
  gitSha: string;
  packages: {
    installed: {
      id: InstalledLibIds;
      version: string;
    }[];
    externals: {
      id: ExternalLibIds;
      version: string;
      name: string;
    }[];
  };
  configs: {
    // TODO: agree on single source of truth for widget config type
    widgetConfig: (Widget & Record<string, unknown>)[];
    pluginConfig: (Widget & Record<string, unknown>)[];
  };
};
