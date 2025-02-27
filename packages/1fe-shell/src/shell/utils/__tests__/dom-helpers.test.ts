import { injectPreloadTags } from '../dom-helpers';

describe('injectPreloadTags', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should inject preload link tags with default "as" value as script', () => {
    const preloadUrls = [
      'https://example.com/script1.js',
      'https://example.com/script2.js',
    ];

    injectPreloadTags(preloadUrls);

    const links = document.querySelectorAll('link[rel="preload"]');
    expect(links.length).toBe(2);

    expect(links[0].getAttribute('href')).toBe(preloadUrls[0]);
    expect(links[0].getAttribute('as')).toBe('script');
    expect(links[0].getAttribute('crossorigin')).toBe('');

    expect(links[1].getAttribute('href')).toBe(preloadUrls[1]);
    expect(links[1].getAttribute('as')).toBe('script');
    expect(links[1].getAttribute('crossorigin')).toBe('');
  });

  it('should inject preload link tags with "as" value as fetch', () => {
    const preloadUrls = [
      'https://example.com/data1',
      'https://example.com/data2',
    ];

    injectPreloadTags(preloadUrls, 'fetch');

    const links = document.querySelectorAll('link[rel="preload"]');
    expect(links.length).toBe(2);

    expect(links[0].getAttribute('href')).toBe(preloadUrls[0]);
    expect(links[0].getAttribute('as')).toBe('fetch');

    expect(links[1].getAttribute('href')).toBe(preloadUrls[1]);
    expect(links[1].getAttribute('as')).toBe('fetch');
  });

  it('should not inject any tags if preloadUrls is empty', () => {
    injectPreloadTags([]);

    const links = document.querySelectorAll('link[rel="preload"]');
    expect(links.length).toBe(0);
  });
});
