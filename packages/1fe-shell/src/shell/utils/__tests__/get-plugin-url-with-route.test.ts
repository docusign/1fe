import { getPluginUrlWithRoute } from '../url';
import * as urlHelpers from '../url';

describe('getPluginUrlWithRoute function', () => {
  it('should construct a full plugin URL without params', () => {
    jest
      .spyOn(urlHelpers, 'getBaseHrefUrl')
      .mockReturnValue('https://apps.docusign.com/');

    const pluginPathWithParams = '/send/home';
    expect(getPluginUrlWithRoute(pluginPathWithParams)).toBe(
      'https://apps.docusign.com/send/home',
    );
  });

  it('should construct a full plugin URL with params', () => {
    jest
      .spyOn(urlHelpers, 'getBaseHrefUrl')
      .mockReturnValue('https://apps.docusign.com/');

    const pluginPathWithParams = '/send/home?forceReauth=1';
    expect(getPluginUrlWithRoute(pluginPathWithParams)).toBe(
      'https://apps.docusign.com/send/home?forceReauth=1',
    );
  });

  it('should handle empty plugin path', () => {
    jest
      .spyOn(urlHelpers, 'getBaseHrefUrl')
      .mockReturnValue('https://apps.docusign.com/');

    const pluginPathWithParams = '';
    expect(getPluginUrlWithRoute(pluginPathWithParams)).toBe(
      'https://apps.docusign.com/',
    );
  });

  it('should throw an error if invalid pluginPathWithParams is provided', () => {
    jest
      .spyOn(urlHelpers, 'getBaseHrefUrl')
      .mockReturnValue('https://apps.docusign.com/');

    const invalidPluginPathWithParams = '///'; // Double slash is invalid
    expect(() =>
      getPluginUrlWithRoute(invalidPluginPathWithParams),
    ).toThrowError('Something went wrong building plugin url');
  });
});
