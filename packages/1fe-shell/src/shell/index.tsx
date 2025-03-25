import 'systemjs/dist/extras/dynamic-import-maps.min.js';
import 'systemjs/dist/extras/global.min.js';
import 'systemjs/dist/extras/module-types.min.js';
import 'systemjs/dist/extras/named-register.min.js';
import 'systemjs/dist/extras/use-default.min.js';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './globals.css';
import {
  createDynamicImportMap,
  insertNonPersistentWidgetOverrides,
  insertPersistentWidgetOverrides,
} from './init/import-map';
import {
  readOneFEShellConfigs,
  setOneFEShellConfigs,
} from './configs/shell-configs';
import { getShellLogger } from './utils/telemetry';
import {
  applyRuntimeConfigOverrideForImportMapUi,
  applyRuntimeConfigOverridesForWidgetUrlOverrides,
} from './init/runtime-config-overrides';
import { getShellPlatformUtils as initShellPlatformUtils } from './utils/shell-platform-utils';
import { OneFEShellOptions } from './types/one-fe-shell-options';

export const init = (): Promise<void> => {
  // Initialize import map Promise resolver
  return new Promise((resolve) => {
    try {
      const { importMap, overrides } = createDynamicImportMap();

      // This is to ensure that the widget overrides are available even before the import-map-overrides is loaded
      insertNonPersistentWidgetOverrides(importMap);

      const initImportMap = () => {
        insertPersistentWidgetOverrides(overrides, importMap);
        // logInsertMapCompletion(importMapLoadStartTime, environment, build);

        applyRuntimeConfigOverridesForWidgetUrlOverrides();

        if (readOneFEShellConfigs().mode !== 'production') {
          // import-map-overrides:change fires when the import map is updated via the ui
          window.addEventListener(
            'import-map-overrides:change',
            applyRuntimeConfigOverrideForImportMapUi,
          );
        }

        return resolve();
      };

      if (window?.importMapOverrides) {
        initImportMap();
      } else {
        // if import-map-overrides is not available, listen for the init event
        window.addEventListener('import-map-overrides:init', () => {
          initImportMap();
        });
      }
    } catch (e) {
      const logger = getShellLogger();

      logger.error({
        message: `[IMPORT MAP ERROR]`,
        error: e,
      });

      // logger.logCounter(
      //   {
      //     measure: Date.now() - importMapLoadStartTime,
      //     instance: build ? `${environment}-${build}` : `${environment}`,
      //     success: false,
      //   },
      //   importMapCounterSource,
      // );
    }
  });
};

const renderOneFEShell = (options: OneFEShellOptions) => {
  setOneFEShellConfigs(options);

  initShellPlatformUtils();

  init().then(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.querySelector('#root'),
    );
  });
};

export default renderOneFEShell;
