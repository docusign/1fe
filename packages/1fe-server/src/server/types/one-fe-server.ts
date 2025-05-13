import {
  CSPPerEnvironment,
  ExternalLibConfig,
  InstalledLibConfig,
  WidgetConfig,
} from '.';

// TODO[1fe]: known routes should be optional. Whole server should be optional
export type OneFEServer = {
  bathtub?: boolean;
  knownRoutes: string[];
};

export type OneFECSP = {
  enforced?: CSPPerEnvironment;
  reportOnly?: CSPPerEnvironment;
};

// TODO[1fe]: refreshMs should be required
export type OneFEConfigManagement = {
  getDynamicConfigs?: () => Promise<OneFEDynamicConfigs>;
  url?: string;
  refreshMs?: number;
};

export type OneFEDynamicCDNConfig = {
  libraries: {
    basePrefix: string;
    managed: (ExternalLibConfig | InstalledLibConfig)[];
  };
  widgets: {
    basePrefix: string;
    releaseConfig: WidgetConfig[];
  };
};

export type OneFEImportMapOverrides = {
  enableUI?: boolean;
  allowedSource?: string[];
};

export type Devtools = {
  importMapOverrides?: OneFEImportMapOverrides;
};

export type OneFEDynamicConfigs = {
  cdn: OneFEDynamicCDNConfig;
  devtools?: Devtools;
  browserslistConfig?: string[];
};

export type OneFEServerOptions = {
  mode: 'development' | 'preproduction' | 'production';
  environment: string;
  orgName: string;
  configManagement: OneFEConfigManagement;
  shellBundleUrl: string;
  server: OneFEServer;
  csp?: {
    defaultCSP: OneFECSP;
  };
};

export type OneFEProcessedConfigs = OneFEServerOptions & {
  dynamicConfigs: OneFEDynamicConfigs;
};
