export const ONEFE_ROUTES = {
  WATCHDOG: '/watchdog',
  CSP_REPORT_ONLY: '/csp-report-only',
  CSP_REPORT_VIOLATION: '/csp-report-violation',
  HEALTH: '/health',
  // AUTH: '/auth', // 302 to /authenticate
  // LOGOUT: '/logout', // 302 to /logoutUrl
  // AUTHENTICATE: '/authenticate', // [HTML]
  VERSION: '/version',
  WIDGET_VERSION: '/version/*',
  // API: '/api',
  // LOAD_TEST: '/test/load',
  // CLM_TEST: '/test/clm',
  // AUTH_FORWARDER: '/auth-forwarder/:widgetId',
  INDEX: '/*', // [HTML] MUST BE * to catch all routes
};

export const BASE_KNOWN_ROUTES = {
  HEALTH: '/health',
  VERSION: '/version',
  WIDGET_VERSION: '/version/**',
  FAVICON: '/favicon.ico',
  ROOT: '/',
  SW: '/sw.js',
  ONE_DS_BUNDLE: '/js/bundle.js',
};

export const STATIC_ASSETS = {
  IMAGES: '/images',
  // Query Parameter needed for updating favicon cache
  FAVICON: '/favicon.ico',
};
