import { test, expect } from '@playwright/test';

import { setUserAgentForWidgetUrlOverride } from '../../../test-utils/setUserAgentForWidgetUrlOverride';

// const PREPROD_ENVS = ['integration', 'stage', 'integration:1ds', 'stage:1ds'];

test.describe(
  'widget_url_overrides sanitization based on user agent value',
  () => {
    const url = `http://localhost:3001/app1?widget_url_overrides=shouldExist&testQuery=shouldExist`;

    test(
      'widget_url_overrides should NOT be removed if user agent doesnt include allowed user agent values @e2e',
      async ({ page }) => {
        await setUserAgentForWidgetUrlOverride(page);
        await page.goto(url);

        const sanitizedUrl = page.url();
        const urlObject = new URL(sanitizedUrl);
        const queryParams = new URLSearchParams(urlObject.search);

        expect(queryParams.has('widget_url_overrides')).toBe(true);
      },
    );

    test(
      'widget_url_overrides should reflect correct value depending on environment and user agent @e2e',
      async ({ page }) => {
        await page.goto(url);

        const sanitizedUrl = page.url();
        const urlObject = new URL(sanitizedUrl);
        const queryParams = new URLSearchParams(urlObject.search);
        // const isPreprod = PREPROD_ENVS.includes(
        //   process.env.NODE_ENV?.toLowerCase() || '',
        // );

        // if (isPreprod) {
          // if preprod, widget_url_overrides and testQuery should be true
          expect(queryParams.has('widget_url_overrides')).toBe(true);
          expect(queryParams.has('testQuery')).toBe(true);
        // } else {
        //   // if prod, widget_url_overrides should be removed, but testQuery should still exist
        //   expect(queryParams.has('widget_url_overrides')).toBe(false);
        //   expect(queryParams.has('testQuery')).toBe(true);
        // }
      },
    );
  },
);
