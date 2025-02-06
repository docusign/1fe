
export const externalRedirect =
  (widgetId?: string | null | undefined) =>
  (url: string): void => {
    // logPlatformUtilUsage({
    //   utilNamespace: 'navigation',
    //   functionName: 'externalRedirect',
    //   widgetId: widgetId as string,
    //   args: { url: redactSensitiveData(url) },
    // });

    window.location.href = url;
  };
