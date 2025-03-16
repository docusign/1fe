// import { HOSTED_ENVIRONMENTS } from '@1fe/helpers/isomorphic';
// import { WidgetConfig } from '../../../../../../../isomorphic/types/widgetConfigs.types';
import { WIDGET_CONFIGS } from '../../../../../../configs/config-helpers';
import { WidgetConfig } from '../../../../../../types/widget-config';
import { injectPreloadTags } from '../../../../../../utils/dom-helpers';
import {
  isShellWidget,
  isWidgetTypePinned,
} from '../../../../../../utils/widget-type';
import {
  getRequestedWidgetVersionForConsole,
  queueWidgetPreloadsIfFound,
} from '../widgetConfigUtils';

// import { isWidgetTypePinned } from '../../../../../../../isomorphic/widgetConfigs/widgetType';
// import {
//   injectPreloadTags,
//   isShellWidget,
//   WIDGET_CONFIGS,
// } from '../../../../../../utils';

jest.mock('../../../../../../utils/widget-type', () => ({
  ...jest.requireActual('../../../../../../utils/widget-type'),
  isWidgetTypePinned: jest.fn(),
  isShellWidget: jest.fn(),
}));

jest.mock('../../../../../../utils/dom-helpers', () => ({
  injectPreloadTags: jest.fn(),
}));

jest.mock('../../../../../../configs/config-helpers', () => ({
  WIDGET_CONFIGS: {
    get: jest.fn(),
    values: jest.fn(),
  },
}));

jest.mock('../../../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockImplementation(() => ({
    mode: 'production',
    cdn: {
      widgets: {
        basePrefix: 'https://docucdn-a.akamaihd.net/production/1fe/widgets',
      },
    },
  })),
}));

describe('queueWidgetPreloadsIfFound', () => {
  const hostWidget = {
    widgetId: 'hostWidget',
  } as WidgetConfig;

  const widgetPreloadedByRequestedWidget = {
    widgetId: 'preloadWidget1',
    version: '1.1.0',
  } as WidgetConfig;

  const requestedWidgetConfig = {
    widgetId: 'requestedWidget',
    runtime: {
      preload: [
        { widget: widgetPreloadedByRequestedWidget.widgetId },
        { widget: 'preloadWidget2' }, // should missing from WIDGET_CONFIGS
        { apiGet: 'google.com' },
      ],
    },
  } as WidgetConfig;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.mocked(WIDGET_CONFIGS.get).mockImplementation((widgetId: string) => {
      if (widgetId === widgetPreloadedByRequestedWidget.widgetId) {
        return widgetPreloadedByRequestedWidget;
      }

      return undefined;
    });

    jest.mocked(isShellWidget).mockReturnValue(false);
  });

  it('does nothing for shell widget', () => {
    jest.mocked(isShellWidget).mockReturnValue(true);

    queueWidgetPreloadsIfFound(hostWidget, requestedWidgetConfig);

    expect(injectPreloadTags).not.toHaveBeenCalled();
  });

  it('does nothing if there are no preloads', () => {
    queueWidgetPreloadsIfFound(hostWidget, {
      widgetId: 'widgetWithNoPreloads',
    } as WidgetConfig);

    expect(injectPreloadTags).not.toHaveBeenCalled();
  });

  it('injects preload tags for widgets found in WIDGET_CONFIGS and api calls', () => {
    queueWidgetPreloadsIfFound(hostWidget, requestedWidgetConfig);

    expect(WIDGET_CONFIGS.get).toHaveBeenCalledWith(
      widgetPreloadedByRequestedWidget.widgetId,
    );
    expect(WIDGET_CONFIGS.get).toHaveBeenCalledWith('preloadWidget2');

    expect(injectPreloadTags).toHaveBeenCalledTimes(2);
    expect(injectPreloadTags).toHaveBeenNthCalledWith(
      1,
      [
        `https://docucdn-a.akamaihd.net/production/1fe/widgets/${widgetPreloadedByRequestedWidget.widgetId}/${widgetPreloadedByRequestedWidget.version}/js/1fe-bundle.js`,
      ],
      'script',
    );
    expect(injectPreloadTags).toHaveBeenNthCalledWith(
      2,
      ['google.com'],
      'fetch',
    );
  });
});

describe('getRequestedWidgetVersionForConsole', () => {
  let originalImportMapOverrides: typeof window.importMapOverrides;

  beforeEach(() => {
    jest.restoreAllMocks();
    originalImportMapOverrides = window.importMapOverrides;
  });

  afterEach(() => {
    window.importMapOverrides = originalImportMapOverrides;
  });

  it('should return "widgetRequest undefined" when widgetRequest is undefined', () => {
    const result = getRequestedWidgetVersionForConsole(
      'not-pinning',
      undefined,
    );
    expect(result).toBe('widgetRequest undefined');
  });

  it('should return the widgetRequest if "version" is not a property of the widgetRequest object', () => {
    const widgetRequest = new URL('http://example.com');
    const result = getRequestedWidgetVersionForConsole(
      'not-pinning',
      widgetRequest,
    );
    expect(result).toBe(widgetRequest);
  });

  it('should return the widgetRequest version if there is no override', () => {
    const widgetRequest = {
      widgetId: 'testWidget',
      version: '1.0.0',
    } as unknown as WidgetConfig;
    const result = getRequestedWidgetVersionForConsole(
      'not-pinning',
      widgetRequest,
    );
    expect(result).toBe('1.0.0');
  });

  it('should return the widgetRequest version with (pinned) if there is no override and the widget is pinned', () => {
    const widgetRequest = {
      widgetId: 'testWidget',
      type: 'pinned',
      version: '1.0.0',
    } as unknown as WidgetConfig;
    jest.mocked(isWidgetTypePinned).mockReturnValue(true);
    const result = getRequestedWidgetVersionForConsole(
      'pinning',
      widgetRequest,
    );
    expect(result).toBe('1.0.0 (pinned)');
  });

  it('should return "overridden" if the widgetRequest version has an importMapOverrides override', () => {
    const widgetRequest = {
      widgetId: 'testWidget',
      version: '1.0.0',
    } as unknown as WidgetConfig;
    window.importMapOverrides = {
      getOverrideMap: () => ({
        imports: {
          testWidget: '2.0.0',
        },
      }),
    } as unknown as typeof window.importMapOverrides;
    const result = getRequestedWidgetVersionForConsole(
      'not-pinning',
      widgetRequest,
    );
    expect(result).toBe('overridden');
  });
});
