import { getRoute as _getRoute } from '../get-route';

// jest.mock('../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

// jest.mock('../../../../utils/telemetry', () => ({
//   getShellLogger: () => ({
//     log: jest.fn(),
//     error: jest.fn(),
//   }),
// }));

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../../utils/url', () => ({
  getBaseHrefUrl: () => 'https://apps.dev.docusign.net/',
  // getEnvironmentConfigs: jest.fn(() =>
  //   require('../../../../__tests__/constants').getTestEnvConfig(),
  // ),
}));

const widgetId = '@x/test';
const getRoute = _getRoute(widgetId);

describe('getRoute', () => {
  it('should return route widget path from sub path', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/send/asdf/asdf',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/asdf/asdf');
  });

  it('should return route widget path from sub path with trailing slash', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/send/asdf/asdf/',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/asdf/asdf');
  });

  it('should return forward slash for root widget route', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/send',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/');
  });

  it('should return forward slash for root widget route with trailing slash', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/send',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/');
  });

  it('should get correct route when query params are present', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit?widget_url_overrides={%22@1fe/widget-starter-kit%22:%22http://127.0.0.1:8080/js/1fe-bundle.js%22}',
      },
      writable: true,
    });

    expect(getRoute()).toBe(
      '/?widget_url_overrides={%22@1fe/widget-starter-kit%22:%22http://127.0.0.1:8080/js/1fe-bundle.js%22}',
    );
  });

  it('should get correct route when query params are present (2)', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit?widget_url_overrides={"@1fe/widget-starter-kit":"https://docutest-a.akamaihd.net/integration/1fe/widgets/@1fe/widget-starter-kit/1.0.60/js/1fe-bundle.js"}',
      },
      writable: true,
    });

    expect(getRoute()).toBe(
      '/?widget_url_overrides={%22@1fe/widget-starter-kit%22:%22https://docutest-a.akamaihd.net/integration/1fe/widgets/@1fe/widget-starter-kit/1.0.60/js/1fe-bundle.js%22}',
    );
  });

  it('should get correct route when query params are present (3)', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit?order=asc&color=red',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/?order=asc&color=red');
  });

  it('should get correct route when query params are present and you are not on a root plugin route', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit/foo?order=asc&color=red',
      },
      writable: true,
    });

    expect(getRoute()).toBe('/foo?order=asc&color=red');
  });

  it('should ignore query params when `exludeQueryParams` is set', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit/foo?order=asc&color=red',
      },
      writable: true,
    });

    expect(getRoute(true)).toBe('/foo');
  });

  it('should ignore query params when `exludeQueryParams` is set (2)', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit?widget_url_overrides={"@1fe/widget-starter-kit":"https://docutest-a.akamaihd.net/integration/1fe/widgets/@1fe/widget-starter-kit/1.0.60/js/1fe-bundle.js"}',
      },
      writable: true,
    });

    expect(getRoute(true)).toBe('/');
  });

  it('should ignore query params when `exludeQueryParams` is set and you are not on a root plugin route', () => {
    // mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://apps.dev.docusign.net/starter-kit/foo?widget_url_overrides={"@1fe/widget-starter-kit":"https://docutest-a.akamaihd.net/integration/1fe/widgets/@1fe/widget-starter-kit/1.0.60/js/1fe-bundle.js"}',
      },
      writable: true,
    });

    expect(getRoute(true)).toBe('/foo');
  });
});
