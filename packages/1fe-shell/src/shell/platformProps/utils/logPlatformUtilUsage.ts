import { readOneFEShellConfigs } from '../../configs/shell-configs';
import { PlatformUtils } from '../../types/platform-utils';
import { getShellLogger } from '../../utils/telemetry';

export enum UTIL_NAMESPACE {
  NETWORK = 'network',
}

type UtilNamespace = keyof PlatformUtils;

type LogPlatformUtilUsageArgs = {
  widgetId: string;
  utilNamespace: UtilNamespace;
  functionName: string;
  success?: boolean;
  args?: Record<string, unknown>;
  attributes?: Record<string, unknown>;

  /**
   * @deprecated exists for use with appLoadTime utils who attach top level keys
   */
  topLevelAttributes?: Record<string, unknown>;
};

/**
 * Emit a log for util activity
 * @param widgetId The current widget id
 * @param utilNamespace The util namespace eg. "network"
 * @param functionName The name of the function
 * @param success Is the call successful?
 * @param args What arguments passed to the util
 * @param attributes Additional data to be logged.  Do not include any data that may contain PII
 * @param topLevelAttributes Additional data to be logged.  Do not include any data that may contain PII
 */
export const logPlatformUtilUsage = ({
  widgetId,
  utilNamespace,
  functionName,
  success,
  args,
  attributes,
  topLevelAttributes,
}: LogPlatformUtilUsageArgs): void => {
  // if (isIntegrationEnvironment(ENVIRONMENT)) {
  //   addToPlatformUtilHistory({
  //     invokingWidgetId: widgetId,
  //     util: `${utilNamespace}.${functionName}`,
  //     functionName,
  //     dateTime: new Date(),
  //     args,
  //   });
  // }
  const shouldLogPlatformUtilUsage =
    readOneFEShellConfigs()?.shellLogger?.logPlatformUtilUsage || false;
  if (shouldLogPlatformUtilUsage) {
    getShellLogger().log({
      message: `utils.${utilNamespace}.${functionName} called`,
      category: `utils.${utilNamespace}.${functionName}`,
      widgetId,
      metaData: {
        success,
        arguments: { ...args },
        ...attributes,
      },
      ...topLevelAttributes,
    });
  }
};
