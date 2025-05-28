import { ExternalLibConfig, InstalledLibConfig } from '.';
import { OneFEPlatformConfigs, WidgetConfig } from './raw-cdn-configs';

export type ProcessedWidgetConfig = WidgetConfig & {
  version: string;
};

type ProcessedOneFEWidgetConfigs = {
  basePrefix: string;
  configs: ProcessedWidgetConfig[];
};

type ProcessedOneFELibraryConfigs = {
  basePrefix: string;
  configs: (ExternalLibConfig | InstalledLibConfig)[];
};

export type ProcessedOneFEDynamicConfigs = {
  libraries: ProcessedOneFELibraryConfigs;
  widgets: ProcessedOneFEWidgetConfigs;
  platform: OneFEPlatformConfigs;
};
