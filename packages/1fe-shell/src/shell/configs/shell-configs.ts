import { isEmpty } from "lodash";
import { OneFEShellOptions } from "../types/one-fe-shell-options";

type OneFeShellConfigs = OneFEShellOptions | null;

let oneFEConfigs: OneFeShellConfigs = null;

export const readOneFEShellConfigs = (): OneFEShellOptions => {
  if (isEmpty(oneFEConfigs)) {
    throw new Error('OneFE Shell configs have not been initialized.');
  }

  return oneFEConfigs;
};

export const setOneFEShellConfigs = (newConfigs: OneFEShellOptions) => {
  oneFEConfigs = newConfigs;
};
