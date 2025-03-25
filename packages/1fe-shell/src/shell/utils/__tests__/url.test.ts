import {
  addQueryParamsToPath,
  generateCDNUrl,
  getBaseHrefUrl,
  reloadPage,
  stripTrailingSlash,
} from '../url';

jest.mock('../../configs/config-helpers', () => ({
  DYNAMIC_CONFIGS: {
    cdn: {
      widgets: {
        basePrefix: 'https://someurl.com/',
      },
    },
  },
}));

describe('stripTrailingSlash', () => {
  it('should remove trailing slash', () => {
    expect(stripTrailingSlash('http://localhost.com/')).toBe(
      'http://localhost.com',
    );
    expect(stripTrailingSlash('https://example.org/path/')).toBe(
      'https://example.org/path',
    );
    expect(stripTrailingSlash('ftp://ftp.server.com/dir/')).toBe(
      'ftp://ftp.server.com/dir',
    );
    expect(stripTrailingSlash('/')).toBe('');
  });

  it('should handle URLs without trailing slashes', () => {
    expect(stripTrailingSlash('http://example.com')).toBe('http://example.com');
    expect(stripTrailingSlash('https://subdomain.example.org')).toBe(
      'https://subdomain.example.org',
    );
    expect(stripTrailingSlash('ftp://ftp.server.com')).toBe(
      'ftp://ftp.server.com',
    );
  });
});

describe('addQueryParamsToPath', () => {
  test('should add query parameters to path', () => {
    const path = '/example';
    const queryParams = { param1: 'value1', param2: 'value2' };
    const expected = '/example?param1=value1&param2=value2';

    expect(addQueryParamsToPath(path, queryParams)).toBe(expected);
  });

  test('should handle empty query parameters', () => {
    const path = '/example';
    const queryParams = {};
    const expected = '/example';

    expect(addQueryParamsToPath(path, queryParams)).toBe(expected);
  });

  test('should handle existing query parameters in path', () => {
    const path = '/example?existing=123';
    const queryParams = { param1: 'value1', param2: 'value2' };
    const expected = '/example?existing=123&param1=value1&param2=value2';

    expect(addQueryParamsToPath(path, queryParams)).toBe(expected);
  });
});

describe('reloadPage', () => {
  const globalWindow = Object.create(window);

  afterEach(() => {
    jest.clearAllMocks();
    window = Object.create(globalWindow);
  });

  it('should reload the page', () => {
    Object.defineProperty(window, 'location', {
      value: new Proxy(window.location, {
        set: (_target, _prop, value) => {
          expect(value).toBe(`https://test.com/send?testQ=123&testQ2=456`);
          return true;
        },
        get: (_target, _prop) => {
          return `https://test.com/send?testQ=123&testQ2=456`;
        },
      }),
    });

    reloadPage();
  });

  // it('should reload the page with cache burst', () => {
  //   Object.defineProperty(window, 'location', {
  //     value: new Proxy(window.location, {
  //       set: (_target, _prop, value) => {
  //         expect(value).toBe(
  //           `https://test.com/send?testQ=123&testQ2=456&${SW_CB}=true`,
  //         );
  //         return true;
  //       },
  //       get: (_target, _prop) => {
  //         return `https://test.com/send?testQ=123&testQ2=456`;
  //       },
  //     }),
  //   });

  //   reloadPage({
  //     bustDocumentServiceWorkerCache: true,
  //   });
  // });
});

describe('getBaseHrefUrl', () => {
  it('should return the base href URL', () => {
    const mockDocument = {
      querySelector: () => ({
        getAttribute: () => 'http://example.com/',
      }),
    };

    expect(getBaseHrefUrl(mockDocument as unknown as Document)).toBe(
      'http://example.com/',
    );
  });

  it('should throw an error if base href is missing', () => {
    const mockDocument = { querySelector: () => null };
    expect(() => getBaseHrefUrl(mockDocument as unknown as Document)).toThrow(
      'missing href attribute on base html element',
    );
  });
});

describe('generateCDNUrl', () => {
  it('should return the templatized URL', () => {
    const result = generateCDNUrl({
      widgetId: 'test/widgetId',
      version: '0.0.0',
      plugin: {
        enabled: false,
        route: '/test',
      },
      runtime: {},
    });

    expect(result.toString()).toEqual(
      'https://someurl.com/test/widgetId/0.0.0/js/1fe-bundle.js',
    );
  });
});
