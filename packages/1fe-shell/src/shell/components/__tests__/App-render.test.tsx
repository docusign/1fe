// import { HOSTED_ENVIRONMENTS } from '@1fe/helpers/isomorphic';
import { render } from '@testing-library/react';

// import { PluginConfig } from '../../../isomorphic/types/widgetConfigs.types';
// import { baseUrlProd } from '../../constants/base-urls';
import App from '../../App';
import { PluginConfig } from '../../types/widget-config';

jest.mock('../../platformProps/utils', () => ({
  getPlatformUtils: jest.fn().mockReturnValue({
    logger: jest.fn(() => ({
      createInstance: jest.fn(() => ({
        log: jest.fn(),
        error: jest.fn(),
        logCounter: jest.fn(),
      })),
    })),
    appLoadTime: jest.fn(() => ({
      createInstance: jest.fn().mockReturnValue({
        markEnd: jest.fn(() => void 0),
        markStart: jest.fn(() => void 0),
      }),
    })),
  }),
}));

jest.mock('../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

jest.mock('lottie-react', () => 'lottie');

// jest.mock('../../utils/env-helpers', () => ({
//   getEnvironmentConfigs: jest.fn().mockReturnValue({
//     IS_PROD: false,
//     IS_DEVELOPMENT: true,
//     ENVIRONMENT: HOSTED_ENVIRONMENTS.integration,
//     SERVER_BUILD_NUMBER: 'mock_build',
//     IS_CDN_ENVIRONMENT: true,
//     TELEMETRY_INSTRUMENTATION_KEY: '9c33f89b-9d76-4d4a-a2f0-185e4838d06c',
//     APP_NAME: 'mock app',
//     FEATURE_FLAGS: {
//       enableCacheFirstServiceWorker: false,
//       enableWidgetPropValidation: true,
//       enableShellMemoryRouter: true,
//       widgetBundleDownloadTimeout: { fasterThan5mb: 10000 },
//     },
//   }),
//   getBaseHrefUrl: jest.fn(() => baseUrlProd),
//   basePathname: jest.fn(() => '/'),
//   isIntegration: jest.fn().mockReturnValue(true),
// }));
global['Request'] = jest.fn().mockImplementation(() => ({
  signal: {
    removeEventListener: () => {},
    addEventListener: () => {},
  },
}));

jest.mock('../../utils/url', () => ({
  getBaseHrefUrl: jest.fn(() => 'https://test.com/'),
  basePathname: jest.fn(() => '/'),
}));

jest.mock('../PluginLoader', () => ({
  default: ({ widgetId, route }: PluginConfig) => (
    <div data-qa={`route.${widgetId}.${route}`}>PluginLoader</div>
  ),
}));

global.window.performance.mark = jest.fn();

describe('<App />', () => {
  it('should successfully render', async () => {
    const screen = render(<App />);
    expect(
      await screen.findByText('Looks like this page is not here'),
    ).toBeDefined();
  });
});
