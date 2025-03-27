import { initGo } from '../go';
// import { logPlatformUtilUsage } from '../../logPlatformUtilUsage';

// jest.mock('../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

describe('go', () => {
  // Mock window.history.go
  window = jest.fn() as any;
  Object.defineProperty(window, 'history', {
    value: { go: jest.fn() },
    writable: true,
  });
  const widgetId = '@x/test';

  it('should go back using the window.history.go method', () => {
    initGo(widgetId)(-1);
    initGo(widgetId)(-5);

    // expect(logPlatformUtilUsage).toBeCalledWith({
    //   utilNamespace: 'navigation',
    //   functionName: 'go',
    //   widgetId: widgetId as string,
    //   args: { delta: -1 },
    // });

    expect(window.history.go).toBeCalledWith(-1);
    expect(window.history.go).toBeCalledWith(-5);
  });
  it('should go forwards using the window.history.go method', () => {
    const widgetId = '@x/test';

    initGo(widgetId)(1);
    initGo(widgetId)(5);

    // expect(logPlatformUtilUsage).toBeCalledWith({
    //   utilNamespace: 'navigation',
    //   functionName: 'go',
    //   widgetId: widgetId as string,
    //   args: { delta: 1 },
    // });

    expect(window.history.go).toBeCalledWith(1);
    expect(window.history.go).toBeCalledWith(5);
  });

  it('should reload using the window.history.go method', () => {
    initGo(widgetId)();
    initGo(widgetId)(0);

    // expect(logPlatformUtilUsage).toBeCalledWith({
    //   utilNamespace: 'navigation',
    //   functionName: 'go',
    //   widgetId: widgetId as string,
    //   args: { delta: undefined },
    // });

    expect(window.history.go).toBeCalledWith(undefined);
    expect(window.history.go).toBeCalledWith(0);
  });
});
