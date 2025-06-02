import { CSPPerEnvironment, ExternalLibConfig, InstalledLibConfig } from '.';
import { ProcessedOneFEDynamicConfigs } from './processed-dynamic-configs';
import { OneFEDynamicConfigs, WidgetVersion } from './raw-cdn-configs';

export type OneFEServer = {
  bathtub?: boolean;
  knownRoutes?: string[];
};

export type OneFECSP = {
  enforced?: CSPPerEnvironment;
  reportOnly?: CSPPerEnvironment;
};

type InjectNonce = {
  styleSrc?: boolean;
};

type EcosystemConfigs<T> = { url: string } | { get: () => Promise<T> };

export type OneFEConfigManagement = {
  libraryVersions: EcosystemConfigs<(ExternalLibConfig | InstalledLibConfig)[]>;
  widgetVersions: EcosystemConfigs<WidgetVersion[]>;
  dynamicConfigs: EcosystemConfigs<OneFEDynamicConfigs>;
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
    defaultCSP?: OneFECSP;
    injectNonce?: InjectNonce;
  };
};

export type OneFEProcessedConfigs = OneFEServerOptions & {
  dynamicConfigs: ProcessedOneFEDynamicConfigs;
};
