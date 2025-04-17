import { test, expect } from '@playwright/test';

const metaTags = [
  {
    name: 'title',
    content: 'Hello world SEO!',
  },
  {
    name: 'description',
    content: 'Smart applications for all',
  },
  {
    name: 'keywords',
    content: 'docusign, tutorial, seo, tags',
  },
  {
    name: 'robots',
    content: 'noindex, nofollow',
  },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0',
  },
  {
    name: 'revisit-after',
    content: '5 days',
  },
  {
    name: 'language',
    content: 'en-US',
  },
  {
    'http-equiv': 'content-type',
    content: 'text/html; charset=utf-8',
  },
];

const runtimeOverride = {
  '@1fe/starter-kit': {
    plugin: {
      metaTags,
    },
  },
};

const wskRuntimeOverrideUrl = `http://localhost:3001/app1?runtime_config_overrides=${JSON.stringify(runtimeOverride)}`;

test("Ensure metaTags from a widget's runtimeConfigs are added to the HTML response", async ({
  page,
}) => {
  await page.goto(wskRuntimeOverrideUrl);

  // ensure the following meta tags are present in the HTML response

  for (const tag of metaTags) {
    const tagAttributes = Object.entries(tag).reduce(
      (itr, e) => `${itr}[${e[0]}="${e[1]}"]`,
      '',
    );

    // expect <meta ${tagAttributes} > to exist in the DOM
    expect(await page.$(`meta${tagAttributes}`)).not.toBeUndefined();
  }
});
