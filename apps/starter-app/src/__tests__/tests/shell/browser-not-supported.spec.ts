import { test, expect, Page } from '@playwright/test';

const checkForVisibleUnsupportedBrowserPage = async (
  page: Page,
  isSupported = false,
) => {
  const url = 'http://localhost:3001/app1/utils';
  await page.goto(url);

  const pageTitle = await page.title();

  if (isSupported) {
    await expect(pageTitle).not.toContain('Unsupported Browser');
  } else {
    await expect(pageTitle).toContain('Unsupported Browser');
  }
};

test.describe('test outdated user agent (chrome)', () => {
  test.use({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36',
  });

  test('should show "unsupported browser" page', async ({ page }) => {
    await checkForVisibleUnsupportedBrowserPage(page);
  });
});

test.describe('future latest agent (chrome)', () => {
  test.use({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  });

  test('should NOT show "unsupported browser" page @e2e', async ({ page }) => {
    await checkForVisibleUnsupportedBrowserPage(page, true);
  });
});
