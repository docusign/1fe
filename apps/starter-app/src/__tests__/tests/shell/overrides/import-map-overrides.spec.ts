// import { test, expect } from '@playwright/test';
// import { selectImportMapOverrideButton } from '../../../test-utils/importMapOverridesUi';

// const bundleOverrideUrl =
//   'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-child-widget/1.0.20/js/1ds-bundle.js';
// const runtimeOverrideUrl = getRuntimeConfigUrlFromBundleUrl(bundleOverrideUrl);

// [/*true*/, false].forEach((enable1dsDevtool) => {
//   test(
//     enable1dsDevtool
//       ? 'If enable1dsDevtool is true, Import Map Overrides button visible on stage only @importMapOverrides @e2e'
//       : 'If enable1dsDevtool is false, Import Map Overrides button visible on Int+Stage and not on Demo+Prod @importMapOverrides @e2e',
//     async ({ page }) => {
//       const url = 'http://localhost:3001/app1'
//       // const url = getWskUrlWithDevtoolVisible({ enable1dsDevtool });
//       await page.goto(url);

//       const importMapOverrideButton = selectImportMapOverrideButton(page);

//       // const environment = await getEnvironmentFromDom(page);

//       // if (!enable1dsDevtool) {
//       //   if (isProductionEnvironment(environment)) {
//       //     await expect(importMapOverrideButton).toBeHidden();
//       //   } else {
//           await expect(importMapOverrideButton).toBeVisible();
//         // }

//         // return;
//       // }

//       // if (environment === HOSTED_ENVIRONMENTS.stage) {
//       //   await expect(importMapOverrideButton).toBeVisible();
//       // } else {
//         // await expect(importMapOverrideButton).toBeHidden();
//       // }
//     },
//   );

//   test(
//     `enable1dsDevtool: ${enable1dsDevtool}, Using import-map-overrides ui triggers a runtime config override @importMapOverrides @e2e`,
//     async ({ page, widgetStarterKit }) => {
//       const url = getWskUrlWithDevtoolVisible({ enable1dsDevtool });
//       await page.goto(url);
//       // const environment = await getEnvironmentFromDom(page);

//       // if (isProductionEnvironment(environment)) {
//       //   await expect(selectDevtoolImportMapOverrideButton(page)).toBeHidden();
//       //   await expect(selectImportMapOverrideButton(page)).toBeHidden();
//       //   return;
//       // }

//       const getGenericChildRuntimeConfig = async () =>
//         (await getWidgetConfigFromPage(page, '@internal/generic-child-widget'))
//           ?.runtime;

//       const startingRuntimeConfig = await getGenericChildRuntimeConfig();

//       expect(startingRuntimeConfig).toEqual(
//         expectedCurrentGenericChildRuntimeConfig,
//       );

//       const startingLocalStorage = await getLocalStorage(page);

//       expect(startingLocalStorage).toEqual([]);

//       let haveSeenRuntimeConfigFetch = false;

//       page.on('request', (request) => {
//         if (request.url() === runtimeOverrideUrl) {
//           haveSeenRuntimeConfigFetch = true;
//         }
//       });

//       await overrideWidgetUrlWithUi({
//         page,
//         widgetId: '@internal/generic-child-widget',
//         widgetBundleUrl: bundleOverrideUrl,
//       });

//       expect(haveSeenRuntimeConfigFetch).toBe(true);

//       const endingLocalStorage = await getLocalStorage(page);

//       expect(endingLocalStorage).toEqual(
//         expectedLocalStorageForGenericChildOneOhTwenty,
//       );

//       let haveSeenBundleFetch = false;

//       page.on('request', (request) => {
//         if (request.url() === bundleOverrideUrl) {
//           haveSeenBundleFetch = true;
//         }
//       });

//       await widgetStarterKit.pages.header.goToUtilsPage();

//       await page.reload();

//       expect(haveSeenBundleFetch).toBe(false);

//       await widgetStarterKit.pages.utils.locator.widgetsGetBtn.click();

//       expect(haveSeenBundleFetch).toBe(true);
//     },
//   );

//   test(
//     `enable1dsDevtool: ${enable1dsDevtool}, ?runtime_config_overrides - import map and localStorage runtime configs should be cleared when resetting @e2e`,
//     async ({ page }) => {
//       const url = getWskUrlWithDevtoolVisible({ enable1dsDevtool });
//       await page.goto(url);
//       const environment = await getEnvironmentFromDom(page);

//       if (isProductionEnvironment(environment)) {
//         await expect(selectDevtoolImportMapOverrideButton(page)).toBeHidden();
//         await expect(selectImportMapOverrideButton(page)).toBeHidden();
//         return;
//       }

//       await overrideWidgetUrlWithUi({
//         page,
//         widgetId: '@internal/generic-child-widget',
//         widgetBundleUrl: bundleOverrideUrl,
//       });

//       const endingLocalStorage = await getLocalStorage(page);

//       expect(endingLocalStorage).toEqual(
//         expectedLocalStorageForGenericChildOneOhTwenty,
//       );

//       await resetAllOverrides(page);

//       await page.reload();

//       const clearedLocalStorage = await getLocalStorage(page);

//       expect(clearedLocalStorage).toEqual([]);
//     },
//   );
// });
