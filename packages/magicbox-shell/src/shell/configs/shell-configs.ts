let magicBoxConfigs: any = {};

export const readMagicBoxShellConfigs = () => {
  return magicBoxConfigs;
};

export const setMagicBoxShellConfigs = (newConfigs: any) => {
  magicBoxConfigs = newConfigs;
};
