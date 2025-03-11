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
import { setMagicBoxShellConfigs } from './configs/shell-configs';
import { getShellLogger } from './utils/telemetry';

export const init = (): Promise<void> => {
  // Initialize import map Promise resolver
  return new Promise((resolve) => {
    // const IS_PROD = true;

    try {
      const { importMap, overrides } = createDynamicImportMap();

      // This is to ensure that the widget overrides are available even before the import-map-overrides is loaded
      insertNonPersistentWidgetOverrides(importMap);

      const initImportMap = () => {
        insertPersistentWidgetOverrides(overrides, importMap);
        // logInsertMapCompletion(importMapLoadStartTime, environment, build);

        // TODO[1fe]: Uncomment and move later
        // applyRuntimeConfigOverridesForWidgetUrlOverrides();

        // if (!IS_PROD) {
        //   // import-map-overrides:change fires when the import map is updated via the ui
        //   window.addEventListener(
        //     'import-map-overrides:change',
        //     applyRuntimeConfigOverrideForImportMapUi,
        //   );
        // }

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

const renderMagicBoxShell = (options: any) => {
  setMagicBoxShellConfigs(options);

  // TODO[1fe]: Init utils if needed?

  init().then(() =>
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.querySelector('#root'),
    ),
  );
};

export default renderMagicBoxShell;
