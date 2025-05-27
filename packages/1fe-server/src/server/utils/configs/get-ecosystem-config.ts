import ky from 'ky';
import { OneFEServerOptions } from '../../types/one-fe-server';
import { ExternalLibConfig, InstalledLibConfig } from '../../types';
import {
  OneFEDynamicConfigs,
  WidgetVersion,
} from '../../types/raw-cdn-configs';

type ConfigTypeMap = {
  libraryVersions: (ExternalLibConfig | InstalledLibConfig)[];
  widgetVersions: WidgetVersion[];
  dynamicConfigs: OneFEDynamicConfigs;
};

export const getEcosystemConfig = async (
  options: OneFEServerOptions,
  configType: keyof ConfigTypeMap,
): Promise<ConfigTypeMap[keyof ConfigTypeMap] | null> => {
  const ecosystemConfig = options.configManagement?.[configType];

  if (!ecosystemConfig) {
    return null;
  }

  if ('get' in ecosystemConfig) {
    return await ecosystemConfig.get();
  }

  if ('url' in ecosystemConfig) {
    const response = await ky.get(ecosystemConfig.url, {
      retry: 3,
      timeout: 30 * 1000,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${configType}`);
    }

    return response.json();
  }

  return null;
};
