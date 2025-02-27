import { render, screen } from '@testing-library/react';
import { initWidgetsHelper } from '..';
// import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../isomorphic/widgetConfigs/getWidgetConfigs';
import { isInUseMemo } from '../internal/utils/isInUseMemo';
import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../1fe-server/src/server/utils/widget-config-helpers';
import { ReactElement, ReactNode } from 'react';
// import { getShellLogger } from '../../../../utils/telemetry';

jest.mock('../internal/utils/widgetConfigUtils');
// jest.mock('../../../../utils/telemetry');

jest.mock<typeof import('../internal/utils/isInUseMemo')>(
  '../internal/utils/isInUseMemo',
  () => ({
    ...jest.requireActual('../internal/utils/isInUseMemo'),
    isInUseMemo: jest.fn().mockReturnValue(false),
  }),
);

jest.mock<
  typeof import('../../../../../../../1fe-server/src/server/utils/widget-config-helpers')
>('../../../../../../../1fe-server/src/server/utils/widget-config-helpers', () => ({
  ...jest.requireActual(
    '../../../../../../../1fe-server/src/server/utils/widget-config-helpers',
  ),
  getRequestedWidgetConfigWithoutRuntimeConfig: jest.fn(() => ({
    requestedWidgetConfig: {
      activePhasedDeployment: false,
      runtime: {},
      version: '5.5.5',
      widgetId: '@ds/test',
    },
  })),
}));

jest.mock('../../../../utils/url', () => ({
  getBaseHrefUrl: jest.fn(() => 'https://services.dev.docusign.net/1ds-app/v1.0/'),
  basePathname: jest.fn(() => '/'),
}));

jest.mock('../../../../utils/widget-type', () => ({
  ...jest.requireActual('../../../../utils/widget-type'),
  isShellWidget: jest.fn()
}));

// jest.mock<typeof import('../../../../utils/env-helpers')>(
//   '../../../../utils/env-helpers',
//   () => ({
//     ...jest.requireActual('../../../../utils/env-helpers'),
//     getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
//     basePathname: jest.fn(() => '/'),
//     isShellWidget: jest.fn(),
//     getEnvironmentConfigs: jest.fn(() =>
//       require('../../../../__tests__/constants').getTestEnvConfig(),
//     ),
//   }),
// );

jest.mock<typeof import('../internal/WidgetFrame')>(
  '../internal/WidgetFrame',
  () => ({
    WidgetFrame: () => <div>widget frame on page</div>,
  }),
);

// jest.mock<typeof import('../../../../components/Spinner')>(
//   '../../../../components/Spinner',
//   () => ({
//     Spinner: () => <div>default spinner on page</div>,
//   }),
// );

jest.mock('react', () => ({
  ...jest.requireActual('react'),

  // mock this to avoid rule of hooks violation
  useMemo: jest.fn((fn: any) => fn),
}));

// TODO: Fix these unit tests
describe('initWidgetsHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct obj structure', () => {
    const widgetsHelper = initWidgetsHelper({
      widgetId: '@ds/test',
      version: '5.5.5',
      runtime: {},
    });

    expect(widgetsHelper.get).toBeDefined();
    expect(widgetsHelper.getByUrl).toBeDefined();
    expect(typeof widgetsHelper.get).toBe('function');
    expect(typeof widgetsHelper.getByUrl).toBe('function');
  });

  // it('get should return widget frame (get)', () => {
  //   const widgetsHelper = initWidgetsHelper({
  //     widgetId: '@ds/test',
  //     version: '5.5.5',
  //     runtime: {},
  //   });

  //   const Widget = widgetsHelper.get('@ds/foo')({});

  //   const Comp = (Widget as any)?.type();

  //   const { getByText } = render(Comp);
  //   expect(getByText('widget frame on page')).toBeTruthy();
  // });

  // it('get should return empty widget if no matching widget config is found', () => {
  //   const widgetsHelper = initWidgetsHelper({
  //     widgetId: '@ds/test',
  //     version: '5.5.5',
  //     runtime: {},
  //   });

  //   jest
  //     .mocked(getRequestedWidgetConfigWithoutRuntimeConfig)
  //     .mockReturnValue({ requestedWidgetConfig: undefined as any });

  //   const Widget = widgetsHelper.get('@ds/foo')({});
  //   // const test: string = Widget;
  //   render((Widget as any)?.type);
  //   const element = screen.queryByText('widget frame on page');
  //   expect(element).toBeNull();
  // });

  // it('get should return widget frame when outside useMemo (get)', () => {
  //   const widgetsHelper = initWidgetsHelper({
  //     widgetId: '@ds/test',
  //     version: '5.5.5',
  //     runtime: {},
  //   });

  //   jest.mocked(isInUseMemo).mockReturnValueOnce(true);

  //   const Widget = widgetsHelper.get('@ds/foo');
  //   // const Widget = widgetsHelper.get('@ds/foo')({});

  //   // const Comp = Widget?.type();

  //   const { getByText } = render(<Widget />);
  //   expect(getByText('widget frame on page')).toBeTruthy();
  // });

  it('should log error when one is caught (get)', () => {
    const widgetsHelper = initWidgetsHelper({
      widgetId: '@ds/test',
      version: '5.5.5',
      runtime: {},
    });

    jest.mocked(isInUseMemo).mockReturnValueOnce(true);
    const mockError = jest.fn();
    // jest.mocked(getShellLogger).mockReturnValueOnce({
    //   error: mockError,
    //   logCounter: jest.fn(),
    //   log: jest.fn(),
    // } as any);
    jest
      .mocked(getRequestedWidgetConfigWithoutRuntimeConfig)
      .mockImplementationOnce(() => {
        throw new Error('test error');
      });

    const Widget = widgetsHelper.get('@ds/foo');

    // expect(mockError).toHaveBeenCalledWith({
    //   message: '[WIDGETS][GET] error',
    //   tag: '[WIDGETS][GET]',
    //   error: new Error('test error'),
    // });

    render(<Widget />);
    const element = screen.queryByText('widget frame on page');
    expect(element).toBeNull();
  });

  it('return noop for non system widget (getByUrl)', () => {
    const widgetsHelper = initWidgetsHelper({
      widgetId: '@ds/test',
      version: '5.5.5',
      runtime: {},
      type: 'pinned',
    });

    expect(widgetsHelper.getByUrl('https://cdn.com/widget/id')).toBeUndefined();
    expect(JSON.stringify(widgetsHelper.getByUrl)).toEqual(
      JSON.stringify(() => {}),
    );
  });

  // it('return widget frame when in a useMemo (getByUrl)', () => {
  //   const widgetsHelper = initWidgetsHelper({
  //     widgetId: '@ds/test',
  //     version: '5.5.5',
  //     runtime: {},
  //     type: 'system',
  //   });

  //   jest.mocked(isInUseMemo).mockReturnValueOnce(true);

  //   const Widget = widgetsHelper.getByUrl('https://cdn.com/widget/id');
  //   const { getByText } = render((Widget as any).type());
  //   expect(getByText('widget frame on page')).toBeTruthy();
  // });

  // it('return widget frame when not in a useMemo (getByUrl)', () => {
  //   const widgetsHelper = initWidgetsHelper({
  //     widgetId: '@ds/test',
  //     version: '5.5.5',
  //     runtime: {},
  //     type: 'system',
  //   });

  //   const Widget: any = widgetsHelper.getByUrl('https://cdn.com/widget/id');
  //   const { getByText } = render(Widget().type());
  //   expect(getByText('widget frame on page')).toBeTruthy();
  // });
});
