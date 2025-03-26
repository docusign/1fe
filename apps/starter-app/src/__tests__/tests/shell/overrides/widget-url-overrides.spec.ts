// TODO[1fe]: Re-enable these tests when we have permanent cdn urls for widget overrides
// import { test, expect } from '@playwright/test';
// import { setUserAgentForWidgetUrlOverride } from '../../../test-utils/setUserAgentForWidgetUrlOverride';
// import { getLocalStorage } from '../../../test-utils/localStorage';
// import { getWidgetConfigFromPage } from '../../../test-utils/envs';

// const wskId = '@1ds/widget-starter-kit';
// const genericPinnedId = '@internal/generic-pinned-widget';
// const authId = '@lh/widget';

// const pluginsToTest: { route: string; widgetId: string }[] = [
//   { route: 'widget-demo-auth-test', widgetId: authId },
// ];

// // This is an old version of WSK that is outdated and has old data-qa tags that have since been removed.
// const widgetUrl =
//   'https://docutest-a.akamaihd.net/integration/1ds/widgets/@1ds/widget-starter-kit/1.0.123/js/1ds-bundle.js';

// const genericVariantsUrl =
//   'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-variants-widget/1.0.5/js/1ds-bundle.js';

// const genericPinnedUrl =
//   'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-pinned-widget/1.0.10/js/1ds-bundle.js';

// /**
//  * Create a launch url with the widget url override query params
//  * @param widgetId - the ID of the widget you will be overriding
//  * @param path - the path you want to override on
//  * @returns - the launch url with attached override query params
//  */
// const getUrlWithOverride = (
//   widgetId: string,
//   path: string,
//   overrideUrl?: string,
// ): string =>
//   `http://localhost:3001/app1${path}?widget_url_overrides={"${widgetId}":${ overrideUrl ? overrideUrl : widgetUrl }}`;


// const getUrlNoOverride = (path: string): string =>
//   `http://localhost:3001/app1${path}`;

// test(
//   'Make sure "?widget_url_overrides=" query param works',
//   async ({ page }) => {
//     const responsePromise = page.waitForResponse(widgetUrl);
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(getUrlWithOverride(wskId, 'starter-kit'));

//     const response = await responsePromise;
//     expect(response.status()).toBe(200);

//     await expect(page.getByTestId('wsk.page.home')).toBeVisible();
//     await expect(page.getByTestId('wsk.page.root')).toBeHidden();
//   },
// );

// test(
//   'Make sure override persists after query param is removed @wsk @e2e',
//   async ({ page }) => {
//     const responsePromise = page.waitForResponse(widgetUrl);
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(getUrlWithOverride(wskId, 'starter-kit'));

//     const response = await responsePromise;
//     expect(response.status()).toBe(200);

//     await expect(page.getByTestId('wsk.page.home')).toBeVisible();
//     await expect(page.getByTestId('wsk.page.root')).toBeHidden();

//     const responsePromise2 = page.waitForResponse(widgetUrl);
//     await page.goto(getUrlNoOverride('starter-kit'));

//     const response2 = await responsePromise2;
//     expect(response2.status()).toBe(200);

//     await expect(page.getByTestId('wsk.page.home')).toBeVisible();
//     await expect(page.getByTestId('wsk.page.root')).toBeHidden();
//   },
// );

// test(
//   'Make sure "?widget_url_overrides=" query param works after first loading the page without the query param @wsk @e2e',
//   async ({ page }) => {
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(getUrlNoOverride('starter-kit'));

//     await expect(page.getByTestId('wsk.page.root')).toBeVisible();
//     // Double check that we are not seeing the old WSK content
//     await expect(page.getByTestId('wsk.page.home')).toBeHidden();

//     const responsePromise = page.waitForResponse(widgetUrl);

//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(getUrlWithOverride(wskId, 'starter-kit'));

//     const response = await responsePromise;
//     expect(response.status()).toBe(200);

//     await expect(page.getByTestId('wsk.page.home')).toBeVisible();
//     await expect(page.getByTestId('wsk.page.root')).toBeHidden();
//   },
// );

// // TODO[1fe][post-mvp]: Re-enable when we have pinned widget examples set up
// // test(
// //   '?widget_url_overrides leads to correct pinned widget behavior @e2e',
// //   async ({ page }) => {
// //     await page.goto('http://localhost:3001/app1');

// //     const startingLocalStorage = await getLocalStorage(page);
// //     expect(startingLocalStorage).toEqual([]);

// //     // TODO[1fe][post-mvp]: Add back when complex widget examples w/ runtime configurations are set up
// //     // expect(
// //     //   (await getWidgetConfigFromPage(page, '@internal/generic-child-widget'))
// //     //     ?.runtime,
// //     // ).toEqual(expectedCurrentGenericChildRuntimeConfig);

// //     const bundleOverrideUrl =
// //       'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-child-widget/1.0.20/js/1ds-bundle.js';

// //     const launchUrl = environment.getOneDSLaunchUrl({
// //       shellUrl: SHELL_URL,
// //       path: 'starter-kit',
// //       additionalParams: {
// //         [envConstants.ONEDS_TEST_URL_OVERRIDE_KEY]: environment.oneDSShellUrl,
// //         [INTERNAL_PLUGIN_CODE]: INTERNAL_PLUGIN_GATE_CODE,
// //         [WIDGET_URL_OVERRIDES]: JSON.stringify({
// //           ['@internal/generic-child-widget']: bundleOverrideUrl,
// //         }),
// //       },
// //     });
// //     await setUserAgentForWidgetUrlOverride(page);
// //     await page.goto(launchUrl);

// //     // http://localhost:8080/starter-kit?automated_test_framework=playwright&test_url_override=http%3A%2F%2Flocalhost%3A8080&internal_plugin_code=eeba3ef4ba25c99f47757&widget_url_overrides=%7B%22%40internal%2Fgeneric-child-widget%22%3A%22https%3A%2F%2Fdocutest-a.akamaihd.net%2Fintegration%2F1ds%2Fwidgets%2F%40internal%2Fgeneric-child-widget%2F1.0.20%2Fjs%2F1ds-bundle.js%22%7D

// //     const runtimeConfig = (
// //       await getWidgetConfigFromPage(page, '@internal/generic-child-widget')
// //     )?.runtime;

// //     expect(runtimeConfig).toEqual(expectedOldGenericChildRuntimeConfig);

// //     const endingLocalStorage = await getLocalStorage(page);

// //     expect(endingLocalStorage).toEqual(
// //       expectedLocalStorageForGenericChildOneOhTwenty,
// //     );

// //     await widgetStarterKit.pages.header.goToUtilsPage();

// //     // expect url does not contain widget_url_overrides
// //     expect(page.url()).not.toContain(WIDGET_URL_OVERRIDES);

// //     // validate before and after reload for confidence
// //     const validateLocalStorageAndGenericChildVersion = async () => {
// //       expect(endingLocalStorage).toEqual(
// //         expectedLocalStorageForGenericChildOneOhTwenty,
// //       );

// //       let haveSeenBundleFetch = false;

// //       page.on('request', (request) => {
// //         if (request.url() === bundleOverrideUrl) {
// //           haveSeenBundleFetch = true;
// //         }
// //       });

// //       await widgetStarterKit.pages.header.goToUtilsPage();

// //       expect(haveSeenBundleFetch).toBe(false);

// //       await widgetStarterKit.pages.utils.locator.widgetsGetBtn.click();

// //       // eslint-disable-next-line playwright/no-networkidle
// //       await page.waitForLoadState('networkidle');

// //       expect(haveSeenBundleFetch).toBe(true);
// //     };

// //     await validateLocalStorageAndGenericChildVersion();

// //     await page.reload();

// //     await validateLocalStorageAndGenericChildVersion();
// //   },
// // );

// test(
//   '?widget_url_overrides should not override if using non-whitelisted source @e2e',
//   async ({ page }) => {
//     await page.goto('http://localhost:3001/app1');

//     const startingLocalStorage = await getLocalStorage(page);
//     expect(startingLocalStorage).toEqual([]);

//     expect(
//       (await getWidgetConfigFromPage(page, '@1fe/starter-kit2'))
//         ?.runtime,
//     ).toEqual(expectedCurrentGenericChildRuntimeConfig);

//     const bundleOverrideUrl =
//       'https://docutest-a.akamaihd.net@malicious-site.com/integration/1ds/widgets/@internal/generic-child-widget/1.0.20/js/1ds-bundle.js';

//     const launchUrl = environment.getOneDSLaunchUrl({
//       shellUrl: SHELL_URL,
//       path: 'starter-kit',
//       additionalParams: {
//         [envConstants.ONEDS_TEST_URL_OVERRIDE_KEY]: environment.oneDSShellUrl,
//         [INTERNAL_PLUGIN_CODE]: INTERNAL_PLUGIN_GATE_CODE,
//         [WIDGET_URL_OVERRIDES]: JSON.stringify({
//           ['@internal/generic-child-widget']: bundleOverrideUrl,
//         }),
//       },
//     });
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(launchUrl);

//     const endingLocalStorage = await getLocalStorage(page);

//     const hasOverrideInLocalStorage = endingLocalStorage.some(
//       (item) =>
//         item.name === 'import-map-override:@internal/generic-child-widget',
//     );

//     // There should be zero overrides in local storage.
//     expect(hasOverrideInLocalStorage).toBe(false);
//   },
// );

// test(
//   '?widget_url_overrides - import map and localStorage runtime configs should be cleared when resetting',
//   async ({ page }) => {
//     if (isProdEnvironmentRun) {
//       const button = selectImportMapOverrideButton(page);
//       await expect(button).toBeHidden();
//       return;
//     }

//     const bundleOverrideUrl =
//       'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-child-widget/1.0.20/js/1ds-bundle.js';

//     const launchUrl = environment.getOneDSLaunchUrl({
//       shellUrl: SHELL_URL,
//       path: 'starter-kit',
//       additionalParams: {
//         [envConstants.ONEDS_TEST_URL_OVERRIDE_KEY]: environment.oneDSShellUrl,
//         [INTERNAL_PLUGIN_CODE]: INTERNAL_PLUGIN_GATE_CODE,
//         [WIDGET_URL_OVERRIDES]: JSON.stringify({
//           ['@internal/generic-child-widget']: bundleOverrideUrl,
//         }),
//       },
//     });

//     const urlWithoutAutomatedTestFramework = new URL(`${launchUrl}`);
//     urlWithoutAutomatedTestFramework.searchParams.delete(
//       'automated_test_framework',
//     );
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(urlWithoutAutomatedTestFramework.toString());

//     const validateLocalStorage = async () => {
//       const endingLocalStorage = await getLocalStorage(page);

//       expect(endingLocalStorage).toEqual(
//         expectedLocalStorageForGenericChildOneOhTwenty,
//       );
//     };

//     await validateLocalStorage();

//     urlWithoutAutomatedTestFramework.searchParams.delete(WIDGET_URL_OVERRIDES);
//     await setUserAgentForWidgetUrlOverride(page);
//     await page.goto(urlWithoutAutomatedTestFramework.toString());

//     await validateLocalStorage();

//     await resetAllOverrides(page);

//     await page.reload();

//     const clearedLocalStorage = await getLocalStorage(page);

//     expect(clearedLocalStorage).toEqual([]);
//   },
// );

// // TODO[1fe][post-mvp]: Re-enable when we have variant widget support and examples set up
// // test(
// //   'Make sure "?widget_url_overrides=" query param should work with a default variant bundle @e2e',
// //   async ({ page }) => {
// //     const responsePromise = page.waitForResponse(genericVariantsUrl);
// //     await setUserAgentForWidgetUrlOverride(page);
// //     await page.goto(
// //       getUrlWithOverride(wskId, 'starter-kit', genericVariantsUrl),
// //     );

// //     const response = await responsePromise;
// //     expect(response.status()).toBe(200);

// //     await expect(page.getByTestId('wsk.page.home')).toBeHidden();

// //     await page
// //       .getByTestId('generic.child.utils.widgets.get.variant.btn')
// //       .click();

// //     await expect(
// //       page.getByTestId('generic.widget.variant.on.page'),
// //     ).toBeVisible();
// //   },
// // );

// // TODO[1fe][post-mvp]: Re-enable when we have pinned widget examples set up
// // test(
// //   'Using "?widget_url_overrides=" query param should respect overrided version when pinning widget @e2e',
// //   async ({ page }) => {
// //     await setUserAgentForWidgetUrlOverride(page);
// //     await page.goto(
// //       getUrlWithOverride(
// //         genericPinnedId,
// //         'starter-kit/utils',
// //         genericPinnedUrl,
// //       ),
// //     );

// //     await page.getByTestId('utils.widgets.get.btn').click();
// //     await page
// //       .getByTestId('generic.child.utils.widgets.get.btn-pinned')
// //       .click();

// //     const pinnedWidgetInnerText = await page
// //       .getByTestId('pinned.widget.data')
// //       .innerText();

// //     const pinnedWidgetData = JSON.parse(pinnedWidgetInnerText);

// //     expect(pinnedWidgetData.packageJsonVersion).toBe('1.0.10');
// //   },
// // );
