// import { logPlatformUtilUsage } from '../../logPlatformUtilUsage';
import { externalRedirect } from '../external-redirect';

// jest.mock('../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

describe('externalRedirect', () => {
  it('should redirect using the window.location object', () => {
    // Mock window.location.href
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://services.dev.docusign.net/1fe-app/v1.0/send',
      },
      writable: true,
    });

    expect(window.location.href).toBe(
      'https://services.dev.docusign.net/1fe-app/v1.0/send',
    );

    const widgetId = '@x/test';

    externalRedirect(widgetId)('https://google.com');

    // expect(logPlatformUtilUsage).toHaveBeenCalledWith({
    //   utilNamespace: 'navigation',
    //   functionName: 'externalRedirect',
    //   widgetId: widgetId as string,
    //   args: { url: 'https://google.com' },
    // });
    expect(window.location.href).toBe('https://google.com');
  });
});
