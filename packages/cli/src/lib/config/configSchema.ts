import { Configuration as WebpackConfig } from 'webpack';
import { z } from 'zod';
import { commonConfigSchema } from './commonConfigSchema';

const preloadSchema = z
  .union([
    z.object({ apiGet: z.string() }),
    z.object({ widget: z.string() }),
    z.object({ html: z.string() }),
  ])
  .array();

const dependsOnPinnedWidgets = z
  .object({
    widgetId: z.string(),
    version: z.string(),
  })
  .array();

const dependsOnWidgets = z
  .object({
    widgetId: z.string(),
    version: z.string(),
  })
  .array();

const dependsOnSchema = z.object({
  pinnedWidgets: dependsOnPinnedWidgets.optional(),
  widgets: dependsOnWidgets.optional(),
});

const runtimeConfigSchema = z.object({
  dependsOn: dependsOnSchema.optional(), // TODO - add a validation here to ensure that a widget of a version exists over here.
  preload: preloadSchema.optional(), // TODO - add a validation here to ensure that a widget of a version exists over here.
});

const runtimeConfigRecordSchema = z.record(
  z.string(),
  z.record(z.string(), runtimeConfigSchema).optional(),
);

export const baseConfigObjectSchema = z.object({
  environments: z.record(
    z.string(),
    z.object({
      commonConfig: commonConfigSchema,
      shellBaseUrl: z.string().url().optional(),
      serverBaseUrl: z.string().url().optional(),
    }),
  ),
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
  webpackConfigs: z.record(z.string(), z.custom<WebpackConfig>()).optional(),
});
