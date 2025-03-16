import { readOneFEShellConfigs } from '../../../../../configs/shell-configs';

export const getDefaultWidgetOptions = () => {
  const getLoader = readOneFEShellConfigs().components.getLoader;

  return {
    variantId: 'default',
    Loader: getLoader(),
  };
};
