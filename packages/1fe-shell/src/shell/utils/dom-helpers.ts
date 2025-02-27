export const injectPreloadTags = (
    preloadUrls: string[] = [],
    as: 'script' | 'fetch' = 'script',
  ): void => {
    return preloadUrls.forEach((url) => {
      const link = document.createElement('link');
      link.href = url;
      link.setAttribute('as', as);
      link.setAttribute('rel', 'preload');
      link.setAttribute('crossorigin', '');
      document.body.appendChild(link);
    });
  };
  