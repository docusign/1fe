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