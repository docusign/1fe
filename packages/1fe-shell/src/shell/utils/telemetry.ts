import { readMagicBoxShellConfigs } from "../configs/shell-configs";

export const getShellLogger = () => {
    return readMagicBoxShellConfigs().shellLogger || {
        log: (logObject: any) => {
          console.log(logObject);
        },
        error: (logObject: any) => {
          console.error(logObject);
        },
      }
}