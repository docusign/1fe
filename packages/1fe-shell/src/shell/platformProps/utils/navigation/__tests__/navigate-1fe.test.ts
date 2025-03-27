import { NavigateFunction } from 'react-router-dom';
// import { shellConsoleLogger } from '@1fe/helpers/client';

import { navigate1FE as _navigate1FE } from '../navigate-1fe';
// import { getEnvironmentConfigs } from '../../../../utils';
import { type EventBusPlatformUtils } from '../../event-bus/types';

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
//   ...jest.requireActual('@1fe/helpers/client'),
//   shellConsoleLogger: {
//     warn: jest.fn(),
//   },
// }));

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../../utils/url', () => ({
  ...jest.requireActual('../../../../utils/url'),
  getBaseHrefUrl: () => 'https://apps.docusign.com/',
  // getEnvironmentConfigs: jest.fn(() =>
  //   require('../../../../__tests__/constants').getTestEnvConfig(),
  // ),
  getPluginUrlWithRoute: () => 'https://apps.docusign.com/test/documents',
}));

const navigateShellSpy = jest.fn() as NavigateFunction;
const navigateWidgetSpy = jest.fn() as NavigateFunction;
const externalRedirectSpy = jest.fn();
const eventBusSpy = {
  publish: jest.fn(),
} as unknown as EventBusPlatformUtils;

const widgetId = '@x/test';

const navigate1FE = _navigate1FE({
  navigateShell: navigateShellSpy,
  navigateWidget: navigateWidgetSpy,
  externalRedirect: externalRedirectSpy,
  eventBus: eventBusSpy,
  widgetId,
});

// For all these tests we will assume we are inside the plugin route `/test`
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://apps.docusign.com/test',
  },
  writable: true,
});

describe('navigate1FE', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the shell navigate function and the widget navigate function by default', () => {
    navigate1FE('/documents');

    expect(navigateWidgetSpy).toHaveBeenCalledWith('/documents', undefined);
    expect(navigateShellSpy).toHaveBeenCalledWith('/test/documents', undefined);
    // expect(shellConsoleLogger.warn).not.toHaveBeenCalled();
  });

  it('should call the shell navigate function and the widget navigate function with RRD options', () => {
    navigate1FE('/documents', {
      replace: true,
      state: 'foo',
      relative: 'path',
    });

    expect(navigateWidgetSpy).toHaveBeenCalledWith('/documents', {
      state: 'foo',
      replace: true,
      relative: 'path',
    });
    expect(navigateShellSpy).toHaveBeenCalledWith('/test/documents', {
      state: 'foo',
      replace: true,
      relative: 'path',
    });
    // expect(shellConsoleLogger.warn).toHaveBeenCalled();
  });

  it('should not call the widget navigate function when `pluginToPluginNavigation` is set', () => {
    navigate1FE('/test/documents', { pluginToPluginNavigation: true });

    expect(navigateWidgetSpy).not.toBeCalled();
    expect(externalRedirectSpy).toHaveBeenCalledWith(
      'https://apps.docusign.com/test/documents',
    );
    // expect(shellConsoleLogger.warn).not.toHaveBeenCalled();
  });

  it('should not call the shell navigate function when `doNotUpdateUrl` is set', () => {
    navigate1FE('/documents', { doNotUpdateUrl: true });

    expect(navigateWidgetSpy).toHaveBeenCalledWith('/documents', undefined);
    expect(navigateShellSpy).not.toBeCalled();
    // expect(shellConsoleLogger.warn).not.toHaveBeenCalled();
  });

  it('should log deprecation warning for unsupported options below prod', () => {
    // (getEnvironmentConfigs as jest.Mock).mockReturnValue({
    //   ...require('../../../../__tests__/constants').getTestEnvConfig(),
    //   IS_PROD: false,
    // });

    // @ts-expect-error intentionally passing an unsupported option
    navigate1FE('/documents', { iAmNotSupported: 'hello' });

    // expect(shellConsoleLogger.warn).toHaveBeenCalledWith(
    //   expect.stringContaining(
    //     'The use of the ReactRouterNavigateOptions options param type is deprecated and will be removed in the next major release. Please use the the overload with the SupportedOneDsNavOptions param type instead.',
    //   ),
    // );
  });

  it('should publish navigating event when shellNavigate is called', () => {
    navigate1FE('/documents');

    expect(navigateWidgetSpy).toHaveBeenCalledWith('/documents', undefined);
    expect(navigateShellSpy).toBeCalled();
    expect(eventBusSpy.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        targetWidgetId: '@ds/send',
        eventName: 'navigating',
        data: null,
      }),
    );
  });
});
