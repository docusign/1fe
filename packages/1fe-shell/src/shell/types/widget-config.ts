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

// TODO: change this type
export type CSPDirectives = {
  development: CSPPerEnvironment;
  integration: CSPPerEnvironment;
  stage: CSPPerEnvironment;
  demo: CSPPerEnvironment;
  production: CSPPerEnvironment;
};

export type AuthenticationType = 'required' | 'lazy';
export type WidgetType = 'pinned' | 'system';

export type DynamicCsp = {
  enableDynamicCspHeader: boolean;
};

type AuthZConfig = {
  csp?: DynamicCsp;
};

// 1ds-config Baseline auth config
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

export type UserExperienceConfig = {
  useShellLoadingScreen?: boolean;
};

type MetaTags = Record<string, string>[];

type RuntimePluginConfig = {
  auth?: AuthConfig;
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
  authZ?: AuthZConfig;
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
  _url?: string;
  plugin?: PluginConfigRaw;
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

// export type EnvConfig = {
//   IS_DEVELOPMENT: boolean;
//   IS_PROD: boolean;
//   ENVIRONMENT: HostedEnvironment;
//   VERSION: string;
//   SERVER_BUILD_NUMBER: string;
//   IS_CDN_ENVIRONMENT: boolean;
//   TELEMETRY_INSTRUMENTATION_KEY: Guid;
//   APP_NAME: string;
//   FEATURE_FLAGS: ClientFeatureFlags;
//   IP_ADDRESS: string;
//   HTTP_404_NOT_FOUND_URL: string;
//   IS_AUTOMATION_RUN?: boolean;
// };
