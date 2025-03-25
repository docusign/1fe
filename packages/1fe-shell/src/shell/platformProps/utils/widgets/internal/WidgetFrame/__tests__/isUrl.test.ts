import { isUrl } from '../is-url';

describe('isUrl', () => {
  it('should return true when the input is a URL object', () => {
    const url = new URL('https://example.com');
    expect(isUrl(url)).toBe(true);
  });

  it('should return false when the input is a string', () => {
    const urlString = 'https://example.com';
    expect(isUrl(urlString)).toBe(false);
  });

  it('should return false when the input is an invalid URL string', () => {
    const invalidUrlString = 'invalid-url';
    expect(isUrl(invalidUrlString)).toBe(false);
  });

  it('should return false when the input is an empty string', () => {
    const emptyString = '';
    expect(isUrl(emptyString)).toBe(false);
  });

  it('should return false when the input is an object that is not a URL', () => {
    const notAUrl = { foo: 'bar' };
    expect(isUrl(notAUrl as unknown as URL)).toBe(false);
  });
});
