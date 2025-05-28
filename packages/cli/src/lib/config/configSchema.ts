import { Configuration as WebpackConfig } from 'webpack';
import { z } from 'zod';
import { dynamicConfigSchema, managedSchema } from './dynamicConfigSchema';

const preloadSchema = z
  .union([
    z.object({ apiGet: z.string() }),
    z.object({ widget: z.string() }),
    z.object({ html: z.string() }),
  ])
  .array();

export const pinnedWidgetSchema = z.object({
  widgetId: z.string(),
  version: z.string(),
});

export const widgetSchema = z.object({
  widgetId: z.string(),
});

const environmentNameSchema = z.string();

const dependsOnSchema = z.object({
  pinnedWidgets: pinnedWidgetSchema.array().optional(),
  widgets: widgetSchema.array().optional(),
});

export const runtimeConfigSchema = z.object({
  dependsOn: dependsOnSchema.optional(), // TODO - add a validation here to ensure that a widget of a version exists over here.
  preload: preloadSchema.optional(), // TODO - add a validation here to ensure that a widget of a version exists over here.
});

const runtimeConfigRecordSchema = z
  .record(environmentNameSchema, runtimeConfigSchema)
  .optional();

export const environmentSchema = z.object({
  dynamicConfig: dynamicConfigSchema,
  libraryVersions: z.array(managedSchema),
  shellBaseUrl: z.string().url(),
  serverBaseUrl: z.string().url(),
});

export const baseConfigObjectSchema = z.object({
  environments: z.record(environmentNameSchema, environmentSchema),
  bathtubUrl: z.string().url().optional(),
});

export const baseConfigSchema = z.union([
  baseConfigObjectSchema, // this is when base config is defined in the project
  z.string().url(), // this is when base config is fetched from a URL
  z.function().returns(z.promise(baseConfigObjectSchema)), // This is when base config is shared as a npm package
]);

export const onefeConfigurationSchema = z.object({
  /**
   * Part of the configuration that should be externalized and distributed
   */
  baseConfig: baseConfigSchema,

  /**
   * Runtime configuration for the application, per Environment.
   */
  runtimeConfig: runtimeConfigRecordSchema.optional(),

  /**
   * Webpack configs overrides per environment.
   */
  webpackConfigs: z
    .record(environmentNameSchema, z.custom<WebpackConfig>())
    .optional(),
});
