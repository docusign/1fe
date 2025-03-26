import { Page, expect } from '@playwright/test';

export const getLocalStorage = async (page: Page) => {
  const localStorage = (await page.evaluate(() => {
    return Object.entries(window.localStorage).map(([key, value]) => ({
      name: key,
      value,
    }));
  })) as Record<string, string>[];

  return localStorage;
};

// This older version of generic child has a simpler runtime config, used to test runtime config overrides
export const expectedLocalStorageForGenericChildOneOhTwenty =
  expect.arrayContaining([
    {
      name: `@1ds/shell.runtime_config_@internal/generic-child-widget`,
      value: '"{\\"preload\\":[{\\"apiGet\\":\\"/version\\"}]}"',
    },
    {
      name: 'import-map-override:@internal/generic-child-widget',
      value:
        'https://docutest-a.akamaihd.net/integration/1ds/widgets/@internal/generic-child-widget/1.0.20/js/1ds-bundle.js',
    },
  ]);

export const expectedCurrentGenericChildRuntimeConfig = {
  preload: expect.any(Array),
  dependsOn: {
    pinnedWidgets: [
      {
        version: expect.any(String),
        widgetId: '@internal/generic-pinned-widget',
      },
    ],
  },
};

export const expectedOldGenericChildRuntimeConfig = {
  preload: [{ apiGet: '/version' }],
};
