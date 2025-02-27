// import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

export const initGo =
  (widgetId?: string | null | undefined): History['go'] =>
  (delta?: number): void => {
    // logPlatformUtilUsage({
    //   utilNamespace: 'navigation',
    //   functionName: 'go',
    //   widgetId: widgetId as string,
    //   args: { delta },
    // });

    window.history.go(delta);
  };
