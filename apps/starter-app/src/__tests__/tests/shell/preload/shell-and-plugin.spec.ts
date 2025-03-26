// TODO[1fe]: Uncomment this test when we have cdn hosting figured out.
// import { test, expect } from '@playwright/test';


// test(
//   'Shell and Plugin bundles are preloaded & loaded in HTML @preloadAssets @e2e',
//   async ({ page }) => {
//     // store all network events in an array
//     const networkEvents: any = [];
//     page.on('request', (request) => {
//       networkEvents.push(request.url());
//     });
//     await page.goto('http://localhost:3001/app1');

//     await page.waitForURL('http://localhost:3001/app1', {
//       waitUntil: 'load',
//     });

//     // confirm a link rel="preload" exists with the as attribute "script" and the href attribute shellBundleUrl with the crossorigin attribute "anonymous"
//     const shellBundlePreloadLink = await page.$(
//       `link[rel="preload"][as="script"][href="${shellBundleUrl}"][crossorigin="anonymous"]`,
//     );
//     expect(shellBundlePreloadLink).toBeTruthy();

//     // confirm a link rel="preload" exists with the as attribute "script" and the href attribute pluginBundleUrl with the crossorigin attribute "anonymous"
//     const pluginBundlePreloadLink = await page.$(
//       `link[rel="preload"][as="script"][href="${pluginBundleUrl}"][crossorigin="anonymous"]`,
//     );
//     expect(pluginBundlePreloadLink).toBeTruthy();

//     // confirm shellBundlePreloadLink and pluginBundlePreloadLink are present in the network request activity
//     // getEntriesByType('resource') returns an array of all network requests that does not include preload information
//     const networkRequests = await getNetworkResourceEntriesFromPage(page);
//     expect(networkRequests.includes(shellBundleUrl)).toBeTruthy();
//     expect(networkRequests.includes(pluginBundleUrl)).toBeTruthy();
//   },
// );
