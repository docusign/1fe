import { test, expect } from '@playwright/test';

const runtimeOverride = {
  '@1fe/starter-kit': {
    preload: [
      {
        apiGet:
          '/version',
      },
    ]
  },
};

const wskRuntimeOverrideUrl = `http://localhost:3001/app1?runtime_config_overrides=${JSON.stringify(runtimeOverride)}`;

test(
  "Version API Call is preloaded due to WSK's runtimeConfig declaration @preloadAPI @e2e",
  async ({ page }) => {
    await page.goto(wskRuntimeOverrideUrl);


    // confirm a link rel="preload" exists with the as attribute "fetch" and the href attribute "/version" with the crossorigin attribute "anonymous"
    const preloadLink = await page.$(
      'link[rel="preload"][as="fetch"][href="/version"][crossorigin="anonymous"]',
    );
    expect(preloadLink).toBeTruthy();
  },
);
