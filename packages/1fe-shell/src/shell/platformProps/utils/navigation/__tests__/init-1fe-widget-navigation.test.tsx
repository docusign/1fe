import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';

import { getRoute } from '../get-route';
// import { WidgetConfig } from '../../../../../isomorphic/types/widgetConfigs.types';
import { getPlatformProps } from '../../..';
import { useSubscribeWidgetDeepLinking } from '../init-1fe-widget-navigation';
import { WidgetConfig } from '../../../../types/widget-config';
jest.mock('../../../../utils/url', () => ({
  getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
  basePathname: jest.fn(() => '/'),
}));

// jest.mock<typeof import('../../../../utils/env-helpers')>(
//   '../../../../utils/env-helpers',
//   () => ({
//     ...jest.requireActual('../../../../utils/env-helpers'),
//     getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
//     basePathname: jest.fn(() => '/'),
//     getEnvironmentConfigs: jest.fn(() =>
//       require('../../../../__tests__/constants').getTestEnvConfig(),
//     ),
//   }),
// );

jest.mock('lottie-react', () => 'lottie');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ state: 'test state' }),
}));

jest.mock('../get-route', () => ({
  getRoute: jest.fn(() => () => '/test-route'),
}));

const generateProps = () => {
  const widgetId = '@ds/test';

  const testWidget: WidgetConfig = {
    version: '1.2.3',
    widgetId,
    runtime: {},
  };

  return {
    platform: getPlatformProps(testWidget),
    host: {},
  };
};

const TestWidget = (props: ReturnType<typeof generateProps>) => {
  const navigate = useNavigate();

  // TODO: What is the purpose of this line?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // props?.platform?.utils?.navigation?.init1FEWidgetNavigation(
  //   props,
  //   navigate,
  //   useNavigate,
  //   useLocation,
  // );
  return <div>welcome</div>;
};

describe('init1FEWidgetNavigation', () => {
  it('should not let you call `navigate1FE` without initialization', () => {
    const props = generateProps();
    expect(() =>
      props?.platform?.utils?.navigation?.navigate1FE('/route'),
    ).toThrowError();
  });

  it('component (widget) should render without error when `init1FEWidgetNavigation` is called', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <TestWidget {...generateProps()} />
        </MemoryRouter>,
      ),
    ).not.toThrowError();
  });

  it('widget should throw error if `init1FEWidgetNavigation` is used in a component that is not a child of its <MemoryRouter />', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {
      void 0;
    }); // Mute the expected console.errors here
    expect(() => render(<TestWidget {...generateProps()} />)).toThrowError();
    spy.mockRestore();
  });
});

describe('useSubscribeWidgetDeepLinking', () => {
  const navigateWidget = jest.fn();
  const widgetId = 'test-widget';

  beforeEach(() => {
    jest.resetAllMocks();
    (getRoute as jest.Mock).mockReturnValue(() => '/test-route');
  });

  it('should call navigateWidget with shellBrowserRoute when first executed for a widget', () => {
    renderHook(() =>
      useSubscribeWidgetDeepLinking({
        navigateWidget,
        widgetId,
      }),
    );

    expect(getRoute as jest.Mock).toHaveBeenCalledWith(widgetId);
    expect(navigateWidget).toHaveBeenCalledWith('/test-route', {
      state: 'test state',
    });
  });

  it('should not call navigateWidget when executed again for the same widget', () => {
    for (let i = 0; i < 10; i++) {
      const { rerender } = renderHook(
        ({ navigateWidget, widgetId }) =>
          useSubscribeWidgetDeepLinking({
            navigateWidget,
            widgetId,
          }),
        {
          initialProps: { navigateWidget, widgetId },
        },
      );

      // rerendering just to test it for any edge case
      rerender({ navigateWidget, widgetId });
    }

    expect(navigateWidget).toHaveBeenCalledTimes(1);
  });

  it('should call navigateWidget again when re-executed for the same widget after cleanup', () => {
    const unmounts = [];

    for (let i = 0; i < 10; i++) {
      const { unmount } = renderHook(() =>
        useSubscribeWidgetDeepLinking({
          navigateWidget,
          widgetId,
        }),
      );

      unmounts.push(unmount);
    }

    expect(navigateWidget).toHaveBeenCalledTimes(1);

    // Cleanup some but not all, should still not call navigateWidget
    for (let i = 0; i < 5; i++) {
      const unmount = unmounts.pop();
      unmount?.();
    }

    const { unmount } = renderHook(() =>
      useSubscribeWidgetDeepLinking({
        navigateWidget,
        widgetId,
      }),
    );

    unmounts.push(unmount);

    expect(navigateWidget).toHaveBeenCalledTimes(1);

    expect(unmounts.length).toBe(6);

    // unmount all remaining hooks, should call navigateWidget again
    while (unmounts.length) {
      const unmount = unmounts.pop();
      unmount?.();
    }

    renderHook(() =>
      useSubscribeWidgetDeepLinking({
        navigateWidget,
        widgetId,
      }),
    );

    expect(navigateWidget).toHaveBeenCalledTimes(2);
  });
});
