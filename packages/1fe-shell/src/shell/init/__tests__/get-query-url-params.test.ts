import { getQueryURLParams } from "../import-map";

describe('getQueryURLParams', () => {
  it('should return url parameters', () => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: `http://example.com/test`,
        pathname: '/test',
        search: '?testQ=123',
      },
    });

    const result = getQueryURLParams();

    expect(result.get('testQ')).toBe('123');
  });
});
