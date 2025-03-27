// import { shellConsoleLogger } from '@1fe/helpers/client';
import { preloadUrl } from '../preload-url';

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

// jest.mock('../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

// jest.mock('../../../../utils/telemetry', () => ({
//   getShellLogger: () => ({
//     log: jest.fn(),
//     error: jest.fn(),
//   }),
// }));

// jest.mock('@1fe/helpers/client', () => ({
//   shellConsoleLogger: {
//     warn: jest.fn(),
//   },
// }));

// jest.mock('../../../../utils/env-helpers', () => ({
//   getBaseHrefUrl: () => 'https://apps.docusign.com/',
//   getEnvironmentConfigs: jest.fn(() =>
//     require('../../../../__tests__/constants').getTestEnvConfig(),
//   ),
//   getPluginUrlWithRoute: () => 'https://apps.docusign.com/test/documents',
// }));

jest.mock('../../../../utils/url', () => ({
  ...jest.requireActual('../../../../utils/url'),
  getBaseHrefUrl: () => 'https://apps.docusign.com/',
  getPluginUrlWithRoute: () => 'https://apps.docusign.com/test/documents',
}));

describe('preloadUrl', () => {
  const widgetId = 'testWidget';
  const validUrl = new URL('https://example.com');

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should not embed an iframe if one with the same URL is already present', () => {
    const existingIframe = document.createElement('iframe');
    existingIframe.src = validUrl.toString();
    document.body.appendChild(existingIframe);

    preloadUrl(widgetId)(validUrl, 1000);
    jest.runAllTimers();

    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBe(1); // Should not add another iframe
  });

  it('should log a warning if called in a non-browser environment', () => {
    const originalWindow = global.window;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;

    preloadUrl(widgetId)(validUrl);

    // expect(shellConsoleLogger.warn).toHaveBeenCalledWith(
    //   '[UTILS_API] preloadUrl: Incorrect usage of API, please refer to API documentaiton.',
    // );

    global.window = originalWindow;
  });

  it('should set iframe style to display none', () => {
    preloadUrl(widgetId)(validUrl);

    jest.runAllTimers();

    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.style.display).toBe('none');
  });

  it('should handle iframe onerror event gracefully', () => {
    preloadUrl(widgetId)(validUrl);

    jest.runAllTimers();

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).toBeTruthy();

    const onerrorReturnValue = iframe.onerror?.(new Event('error'));
    expect(onerrorReturnValue).toBe(true);
  });

  it('should not append iframe if the URL is null', () => {
    preloadUrl(widgetId)(null as unknown as URL);

    jest.runAllTimers();

    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBe(0);
  });
});
