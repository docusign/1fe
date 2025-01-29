let magicBoxConfigs: any = {};

export const readMagicBoxConfigs = () => {
    return magicBoxConfigs;
};

export const setMagicBoxConfigs = (newConfigs: any) => {
    magicBoxConfigs = newConfigs;
};