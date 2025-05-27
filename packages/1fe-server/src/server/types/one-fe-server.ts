import { CSPPerEnvironment, ExternalLibConfig, InstalledLibConfig } from '.';
import { ProcessedOneFEDDynamicConfigs } from './processed-dynamic-configs';
import { OneFEDynamicConfigs, WidgetVersion } from './raw-cdn-configs';

export type OneFEServer = {
  bathtub?: boolean;
  knownRoutes?: string[];
};

export type OneFECSP = {
  enforced?: CSPPerEnvironment;
  reportOnly?: CSPPerEnvironment;
};

type CriticalConfigs<T> = { url: string } | { get: () => Promise<T> };

export type OneFEConfigManagement = {
  libraryVersions: CriticalConfigs<(ExternalLibConfig | InstalledLibConfig)[]>;
  widgetVersions: CriticalConfigs<WidgetVersion[]>;
  dynamicConfigs: CriticalConfigs<OneFEDynamicConfigs>;
  refreshMs: number;
};

export type OneFEServerOptions = {
  environment: string;
  isProduction: boolean;
  orgName: string;
  configManagement: OneFEConfigManagement;
  shellBundleUrl: string;
  server?: OneFEServer;
  csp?: {
    defaultCSP: OneFECSP;
  };
};

export type OneFEProcessedConfigs = OneFEServerOptions & {
  dynamicConfigs: ProcessedOneFEDDynamicConfigs;
};
