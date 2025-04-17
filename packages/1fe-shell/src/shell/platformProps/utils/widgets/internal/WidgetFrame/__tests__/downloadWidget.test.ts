// import { getDefaultClientFeatureFlagsWithOverrides } from '../../../../../../../__tests__/test-utils/featureFlags';
// import { getTestEnvConfig } from '../../../../../../__tests__/constants';
// import { getEnvironmentConfigs } from '../../../../../../utils';
import { isOverrideElementActive } from '../../../../../../init/import-map-ui';
import { widgets } from '../../system';
import { downloadWidget } from '../downloadWidget';
import { isUrl } from '../is-url';

// import { isOverrideElementActive } from '../../../../../../init/widget-overrides/isOverrideActive';
// import { validateHostPropsContract } from '../../utils/validateHostPropsContract';

// jest.mock(
//   '../../../../../../components/system-widgets/Devtool/platformUtilHistoryCache',
//   () => ({
//     addToPlatformUtilHistory: jest.fn(),
//   }),
// );

jest.mock('../is-url', () => ({
  isUrl: jest.fn(),
}));

jest.mock('../../../../../../init/import-map-ui');
// jest.mock('../../utils/validateHostPropsContract');

// jest.mock('../../../../../../utils/telemetry', () => ({
//   getShellLogger: jest.fn().mockReturnValue({
//     error: jest.fn(),
//     log: jest.fn(),
//     logCounter: jest.fn(),
//   }),
// }));

jest.mock<typeof import('../../system')>('../../system', () => ({
  ...jest.requireActual('../../system'),
  widgets: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ default: () => {}, status: 'fulfilled' }),
    getByUrl: jest
      .fn()
      .mockReturnValue({ default: () => {}, status: 'fulfilled' }),
    getAsset: jest.fn(),
  }),
}));

jest.mock('../../../../../../utils/url', () => ({
  getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
  basePathname: jest.fn(() => '/'),
}));

jest.mock('../../../../../../utils/widget-type', () => ({
  ...jest.requireActual('../../../../../../utils/widget-type'),
  isShellWidget: jest.fn(),
}));

jest.mock('../../../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockImplementation(() => ({})),
}));

// jest.mock<typeof import('../../../../../../utils/env-helpers')>(
//   '../../../../../../utils/env-helpers',
//   () => ({
//     ...jest.requireActual('../../../../../../utils/env-helpers'),
//     getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
//     basePathname: jest.fn(() => '/'),
//     isShellWidget: jest.fn(),
//     getEnvironmentConfigs: jest.fn(() =>
//       require('../../../../../../__tests__/constants').getTestEnvConfig({
//         FEATURE_FLAGS: getDefaultClientFeatureFlagsWithOverrides(),
//       }),
//     ),
//   }),
// );

describe('downloadWidget', () => {
  it('should download widget (widget ID)', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    window.performance.mark = mockMark;
    const result = await downloadWidget('@ds/test', () => {}, {
      hostProps: {},
      hostWidgetId: '@ds/send',
      widgetFrameId: 'id',
      widgetOptions: { variantId: '@ds/variant', Loader: null },
    });

    expect(result).toEqual({
      default: expect.any(Function),
      status: 'fulfilled',
    });
    window = originalWindow;
  });

  it('should download widget (url)', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    window.performance.mark = mockMark;
    const result = await downloadWidget(
      new URL('https://cdn.production.com/widget/id'),
      () => {},
      {
        hostProps: {},
        hostWidgetId: '@ds/test',
        widgetFrameId: 'id',
        widgetOptions: {
          variantId: '@ds/variant',
          Loader: null,
        },
      },
    );

    expect(result).toEqual({
      default: expect.any(Function),
      status: 'fulfilled',
    });
    window = originalWindow;
  });

  it('should download when widget is not overriden', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    window.performance.mark = mockMark;

    jest.mocked(isOverrideElementActive).mockReturnValueOnce(true);

    const result = await downloadWidget('@ds/test', () => {}, {
      hostProps: {},
      hostWidgetId: '@ds/send',
      widgetFrameId: 'id',
      widgetOptions: { variantId: '@ds/variant', Loader: null },
    });

    expect(result).toEqual({
      default: expect.any(Function),
      status: 'fulfilled',
    });
    window = originalWindow;
  });
  it('should throw error if module default is not a function', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    window.performance.mark = mockMark;

    jest.mocked(widgets).mockReturnValueOnce({
      get: jest.fn().mockReturnValue({ default: 'not a function' }),
      getByUrl: jest.fn(),
      getAsset: jest.fn(),
    });

    await expect(
      downloadWidget('@ds/send', () => {}, {
        hostProps: {},
        hostWidgetId: '@ds/host',
        widgetFrameId: 'id',
        widgetOptions: {
          variantId: '@ds/variant',
          Loader: null,
        },
      }),
    ).rejects.toThrow();

    window = originalWindow;
  });

  it('should throw error if module default is null', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    window.performance.mark = mockMark;

    jest.mocked(widgets).mockReturnValueOnce({
      get: jest.fn().mockReturnValue({ default: null }),
      getByUrl: jest.fn(),
      getAsset: jest.fn(),
    });

    await expect(
      downloadWidget('@ds/send', () => {}, {
        hostProps: {},
        hostWidgetId: '@ds/host',
        widgetFrameId: 'id',
        widgetOptions: {
          variantId: '@ds/variant',
          Loader: null,
        },
      }),
    ).rejects.toThrow();

    window = originalWindow;
  });

  it('should throw error if module status is rejected', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    const mockGetEntries = jest.fn();
    window.performance.mark = mockMark;
    window.performance.getEntries = mockGetEntries;

    jest.mocked(widgets).mockReturnValueOnce({
      get: jest.fn().mockReturnValue(
        Promise.reject({
          default: () => {},
          reason: 'an error occured',
        }),
      ),
      getByUrl: jest.fn(),
      getAsset: jest.fn(),
    });

    await expect(
      downloadWidget('@ds/send', () => {}, {
        hostProps: {},
        hostWidgetId: '@ds/host',
        widgetFrameId: 'id',
        widgetOptions: {
          variantId: '@ds/variant',
          Loader: null,
        },
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Failed to load widget: @ds/send'),
      }),
    );

    window = originalWindow;
  });

  it('should handle throw of non Error type', async () => {
    const originalWindow = window;
    const mockMark = jest.fn();
    const mockGetEntries = jest.fn();
    window.performance.mark = mockMark;
    window.performance.getEntries = mockGetEntries;

    // jest.mocked(getEnvironmentConfigs).mockReturnValueOnce({
    //   ...getTestEnvConfig({
    //     // should log correct instance when this is not found
    //     SERVER_BUILD_NUMBER: undefined,
    //   }),
    // });

    jest.mocked(isUrl).mockImplementationOnce(() => {
      throw 'not an Error';
    });

    await expect(
      downloadWidget('@ds/send', () => {}, {
        hostProps: {},
        hostWidgetId: '@ds/host',
        widgetFrameId: 'id',
        widgetOptions: {
          variantId: '@ds/variant',
          Loader: null,
        },
      }),
    ).rejects.toThrow(
      'Failed to load widget: @ds/send ErrorMessage: not an Error',
    );

    window = originalWindow;
  });
});
