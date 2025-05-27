import { Router } from 'express';

type PinnedWidget = { widgetId: string; version: string };
type PreloadKey = 'apiGet' | 'html' | 'widget';
export type PreloadType = { [k in PreloadKey]?: string };
type AuthenticationType = 'required' | 'lazy';
type MetaTags = Record<string, string>[];

export interface RoutesInterface {
  path?: string;
  router: Router;
}

export type PluginConfig = {
  enabled: boolean;
  route: string;
  widgetId: string;
  auth?: AuthConfig;
  baselineUrl?: string;
};

export type CSPPerEnvironment = {
  scriptSrc?: string[];
  connectSrc?: string[];
  imgSrc?: string[];
  objectSrc?: string[];
  frameSrc?: string[];
  styleSrc?: string[];
  frameAncestors?: string[];
  mediaSrc?: string[];
  workerSrc?: string[];
  formAction?: string[];
  fontSrc?: string[];
};

export type HeadersConfig = {
  csp?: {
    enforced?: CSPPerEnvironment;
    reportOnly?: CSPPerEnvironment;
  };
};

type AuthConfig = {
  authenticationType: AuthenticationType;
};

type RuntimePluginConfig = {
  auth?: AuthConfig;
  metaTags?: MetaTags;
  baselineUrl?: string;
};

export type RuntimeConfig = {
  dependsOn?: { pinnedWidgets: PinnedWidget[] };
  preload?: PreloadType[];
  plugin?: RuntimePluginConfig;
  headers?: HeadersConfig;
};

export type WidgetType = 'pinned' | 'system';

export type PluginConfigRaw = {
  route: string;
  enabled: boolean;
  auth?: AuthConfig;
  baselineUrl?: string;
};

export type WidgetConfig = {
  widgetId: string;
  version: string;
  runtime: RuntimeConfig;
  type?: WidgetType;
  plugin?: PluginConfigRaw;
};

export type WidgetConfigs<
  T extends PluginConfig | WidgetConfig = WidgetConfig,
> = ReadonlyMap<string, T>;

export type SystemWidgetConfig = {
  widgetId: string;
  version: string;
  _url?: string;
  type: 'system';
};

// corresponds to the installed library JSONs in 1fe-configs
// https://github.docusignhq.com/Core/1fe-configs/blob/main/integration/libraries/%401fe-cli.json
export type InstalledLibConfig = {
  id: string;
  version: string;
  type: 'installed';
};

// corresponds to the external library JSONs in 1fe-configs
// e.g. https://github.docusignhq.com/Core/1fe-configs/blob/main/integration/libraries/react.json
export type ExternalLibConfig = {
  id: string;
  name: string;
  version: string;
  path: string;
  isPreloaded: boolean;
  type: 'external';
};
