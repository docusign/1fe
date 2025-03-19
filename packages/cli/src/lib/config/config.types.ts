import { Configuration as WebpackConfig } from 'webpack';
import { z } from 'zod';

const { object, string, record, union, custom } = z;

const preloadSchema = union([
  object({ apiGet: string() }),
  object({ widget: string() }),
  object({ html: string() }),
]).array();

const dependsOnPinnedWidgets = object({
  widgetId: string(),
  version: string(),
}).array();

const dependsOnWidgets = object({
  widgetId: string(),
  version: string(),
}).array();

const dependsOnSchema = object({
  pinnedWidgets: dependsOnPinnedWidgets.optional(),
  widgets: dependsOnWidgets.optional(),
});

const runtimeConfigSchema = object({
  dependsOn: dependsOnSchema.optional(),
  preload: preloadSchema.optional(),
});

const runtimeConfigRecordSchema = record(
  string(),
  record(string(), runtimeConfigSchema).optional(),
);

const environmentSchema = object({
  serverBaseUrl: string(),
  shellBaseUrl: string(),
});

const baseConfigObjectSchema = object({
  environments: record(string(), environmentSchema),
});

export const baseConfigSchema = union([
  string(),
  baseConfigObjectSchema,
  z.function().returns(z.promise(baseConfigObjectSchema)),
]);

export const onefeConfigurationSchema = object({
  /**
   * Part of the configuration that should be externalized and distributed
   */
  baseConfig: union([
    string(),
    baseConfigObjectSchema,
    z.function().returns(z.promise(baseConfigObjectSchema)),
  ]),

  /**
   * Runtime configuration for the application, per Environment.
   */
  runtimeConfig: runtimeConfigRecordSchema,

  /**
   * Webpack configs overrides per environment.
   */
  webpackConfigs: record(string(), custom<WebpackConfig>()),
});

export type OneFeConfiguration = z.infer<typeof onefeConfigurationSchema>;
export type OneFeBaseConfigObject = z.infer<typeof baseConfigObjectSchema>;
