import { readMagicBoxShellConfigs } from "../../../configs/shell-configs";
import { redactSensitiveData } from "../../../utils/logging-helpers";
import { logPlatformUtilUsage } from "../logPlatformUtilUsage";

export const externalRedirect =
  (widgetId?: string | null | undefined) =>
  (url: string): void => {
    const shouldRedactSensitiveData = readMagicBoxShellConfigs().shellLogger.redactSensitiveData;

    logPlatformUtilUsage({
      utilNamespace: 'navigation',
      functionName: 'externalRedirect',
      widgetId: widgetId as string,
      args: { url: shouldRedactSensitiveData ? redactSensitiveData(url) : url },
    });

    window.location.href = url;
  };
