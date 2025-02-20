export type PinnedWidget = {
    widgetId: string;
    version: string;
  };

export type PreloadTypes = 'apiGet' | 'widget' | 'html';
export type Preload = {
  [K in PreloadTypes]: Record<K, string>;
}[PreloadTypes][];

type Environment = 'development' | 'preproduction' | 'production'

export type CliConfigOptions = {
	commonConfigs: URL,
	isCi: Boolean,
	environment: Environment,
	mode: "development" | "production",
	webpackConfigs: {
		development: {},
		production: {}
    },
    debug: boolean;
};