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
};
