
import * as mockableEnvHelpersObject from '../env.helpers';

describe('getBrowserEnvironment', () => {
  it('should return correct user agent info', () => {
    jest
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      );

    const result: Bowser.Parser.ParsedResult =
      mockableEnvHelpersObject.getBrowserEnvironment();
    expect(result.browser.name).toBe('Chrome');
  });
});
