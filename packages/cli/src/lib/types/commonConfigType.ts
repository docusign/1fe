export type CommonConfig = {
  cdn: Cdn;
  importMapOverrides: ImportMapOverrides;
  browserslistConfig: string[];
};

type Cdn = {
  libraries: Libraries;
  widgets: Widgets;
};

type Libraries = {
  basePrefix: string;
  managed: Managed[];
};

type Managed =
  | {
      id: string;
      version: string;
      type: 'installed';
    }
  | {
      id: string;
      version: string;
      type: 'external';
      name: string;
      isPreloaded: true;
      path: string;
    };

type Widgets = {
  basePrefix: string;
  releaseConfig: ReleaseConfig[];
};

type ReleaseConfig = {
  widgetId: string;
  type?: string;
  plugin: Plugin;
  version: string;
};

type Plugin = {
  enabled: boolean;
  route: string;
  auth?: Auth;
};

type Auth = {
  authenticationType: string;
};

type ImportMapOverrides = {
  enableUI: boolean;
  allowedSources: string[];
};
