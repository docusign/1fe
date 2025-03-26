import { test, expect } from '@playwright/test';

test.describe('session ID cookie', () => {
  test(
    'session ID cookie should exists (non iframe embedded widget without auth) @e2e',
    async ({ page, context }) => {
      await page.goto('http://localhost:3001/app1/utils');

      const cookies = await context.cookies();
      const hasSessionIdCookie = cookies.some(
        (cookie) =>
          cookie.name === 'session_id' &&
          cookie.sameSite === 'None' &&
          cookie.httpOnly === false &&
          cookie.secure === true,
      );

      expect(hasSessionIdCookie).toBeTruthy();
    },
  );

  // TODO[1fe][post-mvp]: add back as follow up. Need to create parent frame to test
  // test(
  //   'session ID cookie should exists and be readable from inside an iframe embedded widget @e2e',
  //   async ({ page }) => {
  //     // TODO: move the iframe playground to a shared repo
  //     const iframePlaygroundUrl =
  //       'https://github.docusignhq.com/pages/luke-hatcher/iframe/';
  //     await page.goto(iframePlaygroundUrl);

  //     page.on('dialog', async (dialog) => {
  //       expect(dialog.message()).toMatch(
  //         // Session ID guid regex
  //         /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  //       );
  //       await dialog.dismiss();
  //     });

  //     // make sure iframe playground loads
  //     await expect(page.getByTestId('iframe.text.input')).toBeVisible();

  //     // type the URL in the input field
  //     await page.fill('input[data-qa="iframe.text.input"]', wskLaunchUrl);

  //     await page.click('button[data-qa="iframe.submit.button"]');

  //     await page.pause();

  //     const iframeLocator = page.frameLocator('iframe[data-qa="iframe.frame"]');

  //     const isEmbeddedWskRendered = iframeLocator.getByTestId('wsk.page.root');
  //     await expect(isEmbeddedWskRendered).toBeVisible();

  //     // navigate to foo page
  //     const fooHeaderButton = iframeLocator?.getByTestId(
  //       'wsk.header.button.foo',
  //     );
  //     await expect(fooHeaderButton).toBeVisible();
  //     await fooHeaderButton.click();
  //     await expect(iframeLocator?.getByTestId('wsk.page.foo')).toBeVisible();

  //     // click sessionId button
  //     await iframeLocator?.getByTestId('wsk.show.sessionId.btn').click();
  //   },
  // );
});
