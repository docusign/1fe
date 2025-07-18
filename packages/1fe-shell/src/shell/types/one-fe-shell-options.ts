import { PluginConfig } from './widget-config';

export type OneFERoutes = {
  defaultRoute: `/${string}`;
};

export type OneFELogObject = {
  message: string;
  [key: string]: any;
};

export type OneFEShellLogger = {
  log: (logObject: OneFELogObject) => void;
  error: (logObject: OneFELogObject) => void;
  logPlatformUtilUsage?: boolean;
  redactSensitiveData?: boolean;
};

export type OneFEAuth = {
  isAuthedCallback: (widgetId: string) => boolean;
  unauthedCallback: (widgetId: string) => void;
};

export type OneFEUtilsFactories = {
  [key: string]: (widgetId: string) => Record<string, object>;
};

export type OneFEErrorComponentProps = {
  type?: 'error' | 'notFound';
  plugin?: PluginConfig;
  message?: string | undefined;
};

export type OneFEComponents = {
  getLoader?: () => JSX.Element;
  getError?: (props: OneFEErrorComponentProps | undefined) => JSX.Element;
};

export type OneFEShellOptions = {
  utils?: OneFEUtilsFactories;
  auth?: OneFEAuth;
  shellLogger?: OneFEShellLogger;
  routes?: OneFERoutes;
  components?: OneFEComponents;
  /**
   * These hooks are used by 1fe shell to execute any configured custom operations
   * during various internal processes in 1fe shell.
   */
  hooks?: {
    /**
     * Callback to be executed before react's render method is called on the document root.
     * Use this to perform any necessary setup before the shell is rendered, for example: registering a service worker,
     * initializing global state, or setting up global event listeners.
     */
    onBeforeRenderShell?: () => void;
  };
};
