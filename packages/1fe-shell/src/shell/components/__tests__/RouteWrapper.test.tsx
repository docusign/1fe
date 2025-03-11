// import { getDefaultClientFeatureFlagsWithOverrides } from '../../../__tests__/test-utils/featureFlags';
// import { PluginConfig } from '../../../isomorphic/types/widgetConfigs.types';
// import { getTestEnvConfig } from '../../__tests__/constants';
// import { getEnvironmentConfigs } from '../../utils';
import { PluginConfig } from '../../types/widget-config';
import { RouteWrapper } from '../RouteWrapper';
import { renderWithBrowserRouterWrapper } from './utils/render-with-router';

// jest.mock<typeof import('../../utils/env-helpers')>(
//   '../../utils/env-helpers',
//   () => ({
//     ...jest.requireActual('../../utils/env-helpers'),
//     getEnvironmentConfigs: jest.fn().mockImplementation(() => ({
//       FEATURE_FLAGS: {},
//     })),
//   }),
// );

// jest.mock<typeof import('../system-widgets/Devtool')>(
//   '../system-widgets/Devtool',
//   () => ({
//     DevtoolOrNull: () => <div>this is the devtool or null</div>,
//   }),
// );

// import { renderWithBrowserRouterWrapper } from './utils';

const plugin: PluginConfig = {
  enabled: true,
  route: '/tester',
  widgetId: '@x/tester',
  baselineUrl: 'https://tester.com',
};

global.PromiseRejectionEvent = jest.fn();

jest.mock('../../platformProps/utils', () => ({
  getPlatformUtils: jest.fn().mockReturnValue({
    logger: jest.fn(() => ({
      createInstance: jest.fn(() => ({
        log: jest.fn(),
        error: jest.fn(),
        logCounter: jest.fn(),
      })),
    })),
  }),
}));

jest.mock('lottie-react', () => 'lottie');

describe('<RouteWrapper />', () => {
  beforeAll(() => {
    // stop errors from showing in the console since we are triggering it on purpose
    jest.spyOn(console, 'error');
    // eslint-disable-next-line no-console
    jest.mocked(console.error).mockImplementation(() => null);
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    jest.mocked(console.error).mockRestore();
  });

  it('should successfully render', () => {
    const { getByText } = renderWithBrowserRouterWrapper(
      <RouteWrapper plugin={plugin}>
        <div>this is my tester widget</div>
      </RouteWrapper>,
    );

    expect(getByText('this is my tester widget'));
  });

  // TODO[1fe]: Fix error boundary
  // it('should wrap route with ErrorBoundary in prod environments and catch uncaught errors', () => {
  //   // jest.mocked(getEnvironmentConfigs).mockReturnValue(
  //   //   getTestEnvConfig({
  //   //     IS_PROD: true,
  //   //   }),
  //   // );
  //   const ThrowError = () => {
  //     throw new Error('Throwing error for testing');
  //   };

  //   const { getByText } = renderWithBrowserRouterWrapper(
  //     <RouteWrapper plugin={plugin}>
  //       <ThrowError />
  //     </RouteWrapper>,
  //   );

  //   expect(getByText('An error has occurred'));
  // });

  // it('should render devtool when on integration with correct flag value', () => {
  //   // jest.mocked(getEnvironmentConfigs).mockReturnValue(
  //   //   getTestEnvConfig({
  //   //     ENVIRONMENT: 'integration',
  //   //     IS_PROD: false,
  //   //     FEATURE_FLAGS: getDefaultClientFeatureFlagsWithOverrides({
  //   //       enable1dsDevtool: true,
  //   //     }),
  //   //   }),
  //   // );

  //   const { getByText } = renderWithBrowserRouterWrapper(
  //     <RouteWrapper plugin={plugin}>
  //       <div>children here</div>
  //     </RouteWrapper>,
  //   );

  //   expect(getByText('children here'));
  //   expect(getByText('this is the devtool or null'));
  // });
});
