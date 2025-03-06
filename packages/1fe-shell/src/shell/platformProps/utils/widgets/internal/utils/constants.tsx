import { readMagicBoxShellConfigs } from '../../../../../configs/shell-configs';

export const getDefaultWidgetOptions = () => {
  const getLoader = readMagicBoxShellConfigs().components.getLoader;

  return {
    variantId: 'default',
    Loader: getLoader()
  }
}