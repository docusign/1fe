export enum ERROR_MIDDLEWARE_TYPES {
    UNSUPPORTED = 'unsupported',
    AUTH_LOGIN_LOOP = 'auth-login-loop',
    DEFAULT = 'error',
}
  
export const ROUTES = {
    WATCHDOG: '/watchdog',
    CSP_REPORT_ONLY: '/csp-report-only',
    CSP_REPORT_VIOLATION: '/csp-report-violation',
    HEALTH: '/health',
    AUTH: '/auth', // 302 to /authenticate
    LOGOUT: '/logout', // 302 to /logoutUrl
    AUTHENTICATE: '/authenticate', // [HTML]
    VERSION: '/version',
    WIDGET_VERSION: '/version/*',
    API: '/api',
    LOAD_TEST: '/test/load',
    CLM_TEST: '/test/clm',
    AUTH_FORWARDER: '/auth-forwarder/:widgetId',
    INDEX: '/*', // [HTML] MUST BE * to catch all routes
};

export const STATIC_ASSETS = {
    IMAGES: '/images',
    // Query Parameter needed for updating favicon cache
    FAVICON: '/favicon.ico?v=2',
    OLD_FAVICON: '/favicon.ico',
};

export const WIDGET_URL_OVERRIDES = 'widget_url_overrides';
export const RUNTIME_CONFIG_OVERRIDES = 'runtime_config_overrides';
export const PLUGIN_ID = 'plugin_id';
export const PLUGIN_DISABLED = 'plugin_disabled';
export const WIDGET_ID_UNAVAILABLE =
  'widgetId unavailable at this point in the runtime';
export const widgetRuntimeConfigUrlFilename = 'widget-runtime-config.json';