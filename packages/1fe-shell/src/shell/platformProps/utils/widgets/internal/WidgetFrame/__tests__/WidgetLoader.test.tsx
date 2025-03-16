// import { DEFAULT_WIDGET_OPTIONS } from '../../platformProps/utils/widgets/internal/utils/constants';
// import {
//   WidgetLoader,
//   WidgetURLLoader,
// } from '../../platformProps/utils/widgets/internal/WidgetFrame/WidgetLoader';

import { renderWithBrowserRouterWrapper } from '../../../../../../components/__tests__/utils/render-with-router';
import { getDefaultWidgetOptions } from '../../utils/constants';
import { WidgetLoader, WidgetURLLoader } from '../WidgetLoader';

// import { renderWithBrowserRouterWrapper } from './utils';

// jest.mock('../../platformProps/utils', () => ({
//   getPlatformUtils: jest.fn().mockReturnValue({
//     logger: jest.fn(() => ({
//       createInstance: jest.fn(() => ({
//         log: jest.fn(),
//         error: jest.fn(),
//         logCounter: jest.fn(),
//       })),
//     })),
//     appLoadTime: jest.fn(() => {
//       return {
//         createInstance: jest.fn().mockReturnValue({
//           markEnd: jest.fn(() => void 0),
//           markStart: jest.fn(() => void 0),
//         }),
//       };
//     }),
//   }),
// }));

// mock `baseHrefUrl` and `basePathname` since they use document.queryselector...
// jest.mock('../../utils/env-helpers', () => ({
//   ...jest.requireActual('../../utils/env-helpers'),
//   getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
//   basePathname: jest.fn(() => '/'),
// }));

jest.mock('../../../../../../utils/url', () => ({
  ...jest.requireActual('../../../../../../utils/url'),
  getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
  basePathname: jest.fn(() => '/'),
}));

jest.mock('../../../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockImplementation(() => ({
    components: {
      Loader: () => <p>Loading...</p>,
    },
  })),
}));

// jest.mock<typeof import('../../utils/env-helpers')>(
//   '../../utils/env-helpers',
//   () => ({
//     ...jest.requireActual('../../utils/env-helpers'),
//     getEnvironmentConfigs: jest.fn(() =>
//       require('../../__tests__/constants').getTestEnvConfig(),
//     ),
//   }),
// );

describe('<WidgetLoader />', () => {
  it('should successfully render', () => {
    renderWithBrowserRouterWrapper(
      <WidgetLoader
        widgetFrameId='@x/tester'
        requestedWidgetConfigOrUrl={{
          widgetId: '@x/tester',
          version: '1.2.3',
          runtime: {},
        }}
        setWidgetRenderStatus={() => void 0}
        widgetProps={{ hello: 'world' }}
        hostWidgetId='@host/widget'
        options={getDefaultWidgetOptions()}
      />,
    );
  });

  it('should successfully render when widgetId === @ds/send', () => {
    renderWithBrowserRouterWrapper(
      <WidgetLoader
        widgetFrameId='@ds/send'
        requestedWidgetConfigOrUrl={{
          widgetId: '@ds/send',
          version: '1.2.3',
          runtime: {},
        }}
        setWidgetRenderStatus={() => void 0}
        widgetProps={{ hello: 'world' }}
        hostWidgetId='@host/widget'
        options={getDefaultWidgetOptions()}
      />,
    );
  });
});

describe('<WidgetURLLoader />', () => {
  it('should successfully render', () => {
    renderWithBrowserRouterWrapper(
      <WidgetURLLoader
        widgetFrameId='@x/tester'
        requestedWidgetConfigOrUrl={
          new URL(
            'https://docutest-a.akamaihd.net/integration/1fe/widgets/@1fe/tester/1.2.3/js/1fe-bundle.js',
          )
        }
        setWidgetRenderStatus={() => void 0}
        widgetProps={{ hello: 'world' }}
        hostWidgetId='@host/widget'
        options={getDefaultWidgetOptions()}
      />,
    );
  });
});
