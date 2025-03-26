import { Page } from '@playwright/test';

/**
 * To prevent XSS with widget_url_override, we check user agent for existence
 * of secret substring values. This should be used whenever widget_url_overrides is used
 * in e2e tests
 * @param page
 * @returns
 */
export const setUserAgentForWidgetUrlOverride = async (
  page: Page,
): Promise<void> => {
  await page.route('**/*', (route, request) => {
    const headers = {
      ...request.headers(),
      'user-agent': '1fe.developer',
    };
    route.continue({ headers });
  });
};
