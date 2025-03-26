import { test, expect } from '@playwright/test';

test.describe(
  'Validation of security middleware headers for different routes',
  () => {
    const xPoweredByValue = '1FE Starter App';
    const noStrictTransportSecurityValue =
      'max-age=31536000; includeSubDomains;';
    const noStoreValue = 'no-store';

    const routes = [
      'health',
      'version',
      'app1', // for index route
    ];
    routes.forEach((route: string) => {
      test(`set for -${route}`, async ({ page }) => {
        let headers: Record<string, string> = {};
        const url = 'http://localhost:3001';
        const currenturl = new URL(url);
        page.on('response', (response) => {
          headers = response.headers();
          return headers;
        });
        await page.goto(`${currenturl.origin}/${route}`, {
          waitUntil: 'commit', // since we're interested only in the network response and page interaction not used in this test
        });
        expect(headers['x-powered-by']).toBe(xPoweredByValue);
        expect(headers['cache-control']).toBe(noStoreValue);
        expect(headers['strict-transport-security']).toBe(
          noStrictTransportSecurityValue,
        );
      });
    });

    test('Validate csp headers', async ({ page }) => {
      const url = 'http://localhost:3001';
      const currenturl = new URL(url);

      const consoleErrors: string[] = [];

      page.on('console', (message) => {
        if (
          message.type() === 'error' &&
          message.text()?.includes('Content Security Policy')
        ) {
          consoleErrors.push(message.text());
        }
      });

      let cspViolationHeaders: Record<string, string> = {};

      page.on('response', async (response) => {
        if (response.url() === `${currenturl.origin}/csp-report-violation`) {
          cspViolationHeaders = response.headers();
        }
      });

      // Wait for the csp-report-only and csp-report-violation responses
      const cspReportViolationResponsePromise = page.waitForResponse(
        '**/csp-report-violation',
      );

      await page.goto(`${currenturl.origin}/starter-kit`, {
        waitUntil: 'domcontentloaded',
      });

      // Fetch a URL that violates the csp policy
      const urlToFetch = 'https://jsonplaceholder.typicode.com/posts/1';

      await page.evaluate(async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return await res.json();
        } catch (error: unknown) {
          return { error: (error as Error).message };
        }
      }, urlToFetch);
      expect(
        consoleErrors[0].includes(
          `Refused to connect to '${urlToFetch}' because it violates the following Content Security Policy directive`,
        ),
      ).toBeTruthy();

      await cspReportViolationResponsePromise;

      expect(cspViolationHeaders['x-powered-by']).toBe(xPoweredByValue);
      expect(cspViolationHeaders['cache-control']).toBe(noStoreValue);
      expect(cspViolationHeaders['strict-transport-security']).toBe(
        noStrictTransportSecurityValue,
      );
    });
  },
);
