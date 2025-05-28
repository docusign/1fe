import { PluginConfigRaw, WidgetType } from '.';

type OneFELibraryConfigs = {
  basePrefix: string;
};

type OneFEImportMapOverrides = {
  enableUI?: boolean;
  allowedSource?: string[];
};

type Devtools = {
  importMapOverrides?: OneFEImportMapOverrides;
};

type OneFEWidgetConfigs = {
  basePrefix: string;
  configs: WidgetConfig[];
};

export type WidgetConfig = {
  widgetId: string;
  type?: WidgetType;
  plugin?: PluginConfigRaw;
};

export type OneFEPlatformConfigs = {
  devtools?: Devtools;
  browserslistConfig: {
    buildTarget: string[];
    unsupportedBrowserScreen: string[];
  };
};

export type WidgetVersion = {
  widgetId: string;
  version: string;
};

export type OneFEDynamicConfigs = {
  libraries: OneFELibraryConfigs;
  widgets: OneFEWidgetConfigs;
  platform: OneFEPlatformConfigs;
};
