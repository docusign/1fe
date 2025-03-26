import { test, expect } from '@playwright/test';

const runtimeOverride = {
  '@1fe/starter-kit': {
    preload: [
      {
        apiGet:
          'https://docutest-a.akamaihd.net/development/1fe/widgets/@1fe/starter-kit/1.0.0/widget-runtime-config.json',
      },
    ]
  },
};

const wskRuntimeOverrideUrl = `http://localhost:3001/app1?runtime_config_overrides=${JSON.stringify(runtimeOverride)}`;

// TODO[1fe][post-mvp]: Use templatized w/ more complex examples
test(
  'Ensure widgets with templatized apiGet has correct request url',
  async ({ page }) => {
    await page.goto(wskRuntimeOverrideUrl);

    const versionData = await fetch('http://localhost:3001/version').then((e) => e.json());
    const {
      configs: { widgetConfig },
    } = versionData;
    const widgetId = '@1fe/starter-kit';
    console.log(widgetConfig);
    const version = widgetConfig.find(
      (plugin: any) => plugin.widgetId === widgetId,
    )?.version;
    // const hostedEnv = process.env.NODE_ENV?.toLowerCase();

    // sanity check since NODE_ENV could be undefined
    // if (hostedEnv) {
      const cdnBaseUrl = 'https://docutest-a.akamaihd.net';
      const expectedRequestUrl = 'https://docutest-a.akamaihd.net/development/1fe/widgets/@1fe/starter-kit/1.0.0/widget-runtime-config.json';
      const requestPromise = page.waitForRequest(expectedRequestUrl);
      await page.reload();
      const request = await requestPromise;
      expect(request).toBeTruthy();
    // }
  },
);
