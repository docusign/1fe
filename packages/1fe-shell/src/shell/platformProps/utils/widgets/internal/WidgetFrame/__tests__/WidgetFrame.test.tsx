import { renderWithBrowserRouterWrapper } from '../../../../../../components/__tests__/utils/render-with-router';
import { WidgetConfig } from '../../../../../../types/widget-config';
import { getDefaultWidgetOptions } from '../../utils/constants';
import { WidgetFrame, WidgetNotFoundError } from '../WidgetFrame';

const widgetFromPlugin: WidgetConfig = {
  widgetId: '@x/tester',
  version: '5.6.7',
  runtime: {},
};

jest.mock('../../../..', () => ({
  getPlatformUtils: jest.fn().mockReturnValue({
    logger: jest.fn(() => ({
      createInstance: jest.fn(() => ({
        log: jest.fn(),
        error: jest.fn(),
        logCounter: jest.fn(),
      })),
    })),
    appLoadTime: jest.fn(() => {
      return {
        createInstance: jest.fn().mockReturnValue({
          markEnd: jest.fn(() => void 0),
          markStart: jest.fn(() => void 0),
        }),
      };
    }),
  }),
}));

describe('<WidgetFrame />', () => {
  it('should successfully render', () => {
    renderWithBrowserRouterWrapper(
      <WidgetFrame
        requestedWidgetConfigOrUrl={widgetFromPlugin}
        widgetNodeId='bnfiufeaskdloij=-asf'
        fallback={<>fallback page here</>}
        hostWidgetId='@host/widget'
        options={getDefaultWidgetOptions()}
      />,
    );
  });
});

describe('WidgetNotFoundError', () => {
  it('should throw error', () => {
    expect(() => WidgetNotFoundError('@ds/test')).toThrow(
      '[WIDGETS][GET] WidgetId @ds/test does not exist in import-map config',
    );
  });
});
