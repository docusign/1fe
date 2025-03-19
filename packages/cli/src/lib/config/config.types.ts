import { Configuration as WebpackConfig } from 'webpack';
import { z } from 'zod';

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
  dependsOn: dependsOnSchema.optional(),
  preload: preloadSchema.optional(),
});

const runtimeConfigRecordSchema = z.record(
  z.string(),
  z.record(z.string(), runtimeConfigSchema).optional(),
);

export const baseConfigObjectSchema = z.object({
  environments: z.record(
    z.string(),
    z.object({
      commonConfigsUrl: z.string().url(),
    }),
  ),
});

export const onefeConfigurationSchema = z.object({
  /**
   * Part of the configuration that should be externalized and distributed
   */
  baseConfig: z.union([
    baseConfigObjectSchema,
    z.string().url(),
    z.function().returns(z.promise(baseConfigObjectSchema)),
  ]),

  /**
   * Runtime configuration for the application, per Environment.
   */
  runtimeConfig: runtimeConfigRecordSchema.optional(),

  /**
   * Webpack configs overrides per environment.
   */
  webpackConfigs: z.record(z.string(), z.custom<WebpackConfig>()).optional(),
});

export type OneFeConfiguration = z.infer<typeof onefeConfigurationSchema>;
export type OneFeBaseConfiguration = z.infer<typeof baseConfigObjectSchema>;
export type OneFeConfigurationObject = Omit<
  OneFeConfiguration,
  'baseConfig'
> & {
  baseConfig: OneFeBaseConfiguration;
};
