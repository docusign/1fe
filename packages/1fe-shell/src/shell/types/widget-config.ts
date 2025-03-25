// TODO: Consolidate types between shell and server

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

export type CSPTypes = keyof CSPPerEnvironment;

export type CSPDirectives = {
  [key: string]: CSPPerEnvironment;
};

export type AuthenticationType = 'required' | 'lazy';
export type WidgetType = 'pinned' | 'system';

// 1fe-config Baseline auth config
type AuthConfig = {
  authenticationType?: AuthenticationType;
};

export type UserExperienceConfig = {
  useShellLoadingScreen?: boolean;
};

type MetaTags = Record<string, string>[];

type RuntimePluginConfig = {
  metaTags?: MetaTags;
  baselineUrl?: string;
};

type HeadersConfig = {
  csp?: {
    enforced?: CSPPerEnvironment;
    reportOnly?: CSPPerEnvironment;
  };
};

export type PinnedWidget = { widgetId: string; version: string };

export type PreloadKey = 'apiGet' | 'html' | 'widget';
export type PreloadType = { [k in PreloadKey]?: string };

export type RuntimeConfig = {
  dependsOn?: { pinnedWidgets: PinnedWidget[] };
  preload?: PreloadType[];
  plugin?: RuntimePluginConfig;
  headers?: HeadersConfig;
};

/**
 * The raw data as stored on optimizely
 */
export type PluginConfigRaw = {
  route: string;
  enabled: boolean;
  auth?: AuthConfig;
  baselineUrl?: string;
};

/**
 * The raw data as stored on optimizely
 */
export type WidgetConfigRaw = {
  widgetId: string;
  type?: WidgetType;
  version: {
    current: string;
    next: string;
    nextReleaseStart: number;
    nextReleaseEnd: number;
    _url?: string;
  };
  plugin?: PluginConfigRaw;
};

/**
 * The plugin config after the raw data is parsed and stored in memory
 */
export type PluginConfig = {
  enabled: boolean;
  route: string;
  widgetId: string;
  auth?: AuthConfig;
  baselineUrl?: string;
};

/**
 * The widget config after the raw data is parsed and stored in memory
 */
export type WidgetConfig = {
  widgetId: string;
  version: string;
  runtime: RuntimeConfig;
  type?: WidgetType;
  plugin?: PluginConfigRaw;
};

export type EnvConfig = {
  environment: string;
  mode: 'development' | 'preproduction' | 'production';
};

export type SystemWidgetConfig = {
  widgetId: string;
  version: string;
  _url?: string;
  type: 'system';
};

export type WidgetConfigs<
  T extends PluginConfig | WidgetConfig = WidgetConfig,
> = ReadonlyMap<string, T>;
