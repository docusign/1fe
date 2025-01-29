export * from './search-params';
export * from './routes';
export * from './libs';

export enum ERROR_MIDDLEWARE_TYPES {
  UNSUPPORTED = 'unsupported',
  AUTH_LOGIN_LOOP = 'auth-login-loop',
  DEFAULT = 'error',
}

export const WIDGET_ID_UNAVAILABLE =
  'widgetId unavailable at this point in the runtime';
export const widgetRuntimeConfigUrlFilename = 'widget-runtime-config.json';

export const PINNED_WIDGET_TYPE = 'pinned' as const;
export const SYSTEM_WIDGET_TYPE = 'system' as const;

export const DUMMY_URL = 'https://dummy.url.com';