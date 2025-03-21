import { getGenericLoader } from '../../../../../components/GenericLoader';
import { readOneFEShellConfigs } from '../../../../../configs/shell-configs';

export const getDefaultWidgetOptions = () => {
  const getLoader = readOneFEShellConfigs()?.components?.getLoader || getGenericLoader;

  return {
    variantId: 'default',
    Loader: getLoader(),
  };
};
