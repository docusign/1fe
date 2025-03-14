import { readOneFEShellConfigs } from '../configs/shell-configs';

export const getShellLogger = () => {
  return (
    readOneFEShellConfigs().shellLogger || {
      log: (logObject: any) => {
        console.log(logObject);
      },
      error: (logObject: any) => {
        console.error(logObject);
      },
      logPlatformUtilUsage: true,
      redactSensitiveData: true,
    }
  );
};
