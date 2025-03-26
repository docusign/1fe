import { test, expect } from '@playwright/test';
import { isEqual } from 'lodash';

import { getWidgetConfigFromPage } from '../../../test-utils/envs';

const wskId = '@1fe/starter-kit2';

const mockRuntimeConfigOverride = {
  [wskId]: {
    plugin: {
      // preload tags are automatically stripped out
      metaTags: [
        {
          name: 'description',
          content: 'This is a dummy widget runtime config override',
        },
      ],
    },
    foo: 'bar',
    baz: 'qux',
    deepObject: {
      foo: 'bar',
      baz: 'qux',
    },
  },
};

const wskRuntimeOverrideUrl = `http://localhost:3001/app1?runtime_config_overrides=${JSON.stringify(mockRuntimeConfigOverride)}`;

test(
  '"?runtime_config_overrides=" query param overrides the runtime config',
  async ({ page }) => {
    await page.goto(wskRuntimeOverrideUrl);

    // check if meta tags are overridden and present in the response html
    for (const tag of mockRuntimeConfigOverride[wskId].plugin.metaTags) {
      const tagAttributes = Object.entries(tag).reduce(
        (itr, e) => `${itr}[${e[0]}="${e[1]}"]`,
        '',
      );

      // expect <meta ${tagAttributes} > to exist in the DOM
      // if (isIntegrationEnv) {
        expect(await page.$(`meta${tagAttributes}`)).not.toBeUndefined();
      // } else {
      //   expect(await page.$(`meta${tagAttributes}`)).toBeNull();
      // }
    }

    const wskRuntimeConfig = await page.evaluate(
      ({ wskId }) => {
        const head = document.querySelector('head');

        const widgetConfigsEl = head?.querySelector(
          'script[type="application/json"][data-1fe-config-id="widget-config"]',
        )?.innerHTML;

        const parsedWidgetConfigs = JSON.parse(widgetConfigsEl as string);

        const wskConfig = parsedWidgetConfigs.find(
          (config: { widgetId: string }) => config.widgetId === wskId,
        );

        const runtimeConfig = wskConfig?.runtime;

        return runtimeConfig;
      },
      { wskId },
    );

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      plugin, // plugin is stripped out
      ...restMockedRuntimeConfig
    } = mockRuntimeConfigOverride[wskId];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plugin: _, ...restRuntimeConfig } = wskRuntimeConfig;

    const isRuntimeConfigOverridden = isEqual(
      restMockedRuntimeConfig,
      restRuntimeConfig,
    );

    // if (isIntegrationEnv) {
      expect(isRuntimeConfigOverridden).toBe(true);
    // } else {
    //   expect(isRuntimeConfigOverridden).toBe(false);
    // }
  },
);

test(
  'runtime_config_overrides should take presidence over widget_url_overrides',
  async ({ page }) => {
    const bundleOverrideUrl =
      'https://docutest-a.akamaihd.net/integration/1fe/widgets/@internal/generic-child-widget/1.0.20/js/1fe-bundle.js';

    const mockRuntimeConfigOverride = {
      preload: [
        {
          apiGet: '/i-am-the-mock-override',
        },
      ],
    };

    const wskRuntimeAndBundleOverrideUrl = `http://localhost:3001/app1?runtime_config_overrides=${JSON.stringify({['@1fe/starter-kit2']: mockRuntimeConfigOverride})}&widget_url_overrides=${JSON.stringify({['@1fe/starter-kit2']: bundleOverrideUrl})}`;

    await page.goto(wskRuntimeAndBundleOverrideUrl);

    const runtimeConfig = (
      await getWidgetConfigFromPage(page, '@1fe/starter-kit2')
    )?.runtime;

    expect(runtimeConfig).toEqual(mockRuntimeConfigOverride);
  },
);

// test(
//   'runtime_config_overrides is disabled on demo and prod',
//   async ({ page }) => {
//     const isIntegrationEnv =
//       environment.environmentName.includes('integration');

//     const mockRuntimeConfigOverride = {
//       preload: [
//         {
//           apiGet: '/i-am-the-mock-override',
//         },
//       ],
//     };

//     const launchUrl = environment.getOneDSLaunchUrl({
//       shellUrl: SHELL_URL,
//       path: 'starter-kit',
//       additionalParams: {
//         [envConstants.ONEDS_TEST_URL_OVERRIDE_KEY]: environment.oneDSShellUrl,
//         [INTERNAL_PLUGIN_CODE]: INTERNAL_PLUGIN_GATE_CODE,
//         [RUNTIME_CONFIG_OVERRIDES]: JSON.stringify({
//           ['@internal/generic-child-widget']: mockRuntimeConfigOverride,
//         }),
//       },
//     });

//     await page.goto(launchUrl);

//     const runtimeConfig = (
//       await getWidgetConfigFromPage(page, '@internal/generic-child-widget')
//     )?.runtime;

//     if (isIntegrationEnv) {
//       expect(runtimeConfig).toEqual(mockRuntimeConfigOverride);
//     } else {
//       expect(runtimeConfig).not.toEqual(mockRuntimeConfigOverride);
//     }
//   },
// );
