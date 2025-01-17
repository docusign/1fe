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

type CSPPerEnvironment = {
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

type HeadersConfig = {
  csp?: {
    enforced?: CSPPerEnvironment;
    reportOnly?: CSPPerEnvironment;
  };
};

type AuthConfig = {
  clientAppId: string;
  scopes?: string[];
  /** required means the whole plugin is auth-restricted and handled by 1ds, whereas lazy means the user is responsible for gating parts of their plugin using 1DS utils . */
  authenticationType: AuthenticationType;
  secretKeyName?: string;
  callbackUri?: string;
  callbackUriIncludeAppToken?: boolean;
  callbackUriHeaders?: Record<string, string>;
  state?: Record<string, any>;
  cookieDomain?: string;
  logoutUri?: string;
  generateAuthTxnId?: boolean;
  useNativeAuth?: boolean;
  ramp1DSAuthPercent?: number;
  authCookiesToClear?: string[];
  skiplogoutUriForBaselineRedirect?: boolean;
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

type WidgetType = 'pinned' | 'system';

type PluginConfigRaw = {
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

export type WidgetConfigRaw = {
  widgetId: string;
  type?: WidgetType;
  version: string;
  plugin?: PluginConfigRaw;
};
  