import { getPluginRoute } from '../get-plugin-route';

// jest.mock('../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

jest.mock('../../../../utils/url', () => ({
  getBaseHrefUrl: () => 'https://apps.dev.docusign.net/',
  // getEnvironmentConfigs: jest.fn(() =>
  //   require('../../../../__tests__/constants').getTestEnvConfig(),
  // ),
}));

// jest.mock('../../../../utils/telemetry', () => ({
//   getShellLogger: () => ({
//     log: jest.fn(),
//     error: jest.fn(),
//   }),
// }));

describe('getRootRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const hrefsToTest = [
    {
      href: 'https://apps.dev.docusign.net/send/asdf/asdf',
      expected: '/send',
    },
    {
      href: 'https://apps.dev.docusign.net/send/asdf/asdf/',
      expected: '/send',
    },
    {
      href: 'https://apps.dev.docusign.net/send',
      expected: '/send',
    },
    {
      href: 'https://apps.dev.docusign.net/starter-kit?widget_url_overrides={%22@1ds/widget-starter-kit%22:%22http://',
      expected: '/starter-kit',
    },
    {
      href: 'https://apps.dev.docusign.net/starter-kit?widget_url_overrides={"@1ds/widget-starter-kit":"https://',
      expected: '/starter-kit',
    },
    {
      href: 'https://apps.dev.docusign.net/starter-kit?order=asc&color=red',
      expected: '/starter-kit',
    },
    {
      href: 'https://apps.dev.docusign.net/starter-kit/foo?order=asc&color=red',
      expected: '/starter-kit',
    },
    {
      href: 'https://apps.docusign.com',
      expected: '/',
    },
  ];

  test.each(hrefsToTest)(
    'should return root route path from href: %s',
    ({ href, expected }) => {
      // mock window.location.href
      window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          href,
        },
        writable: true,
      });

      expect(getPluginRoute()).toBe(expected);
    },
  );
});
