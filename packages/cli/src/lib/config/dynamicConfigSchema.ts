import { z } from 'zod';

export const managedSchema = z.union([
  z.object({
    id: z.string(),
    version: z.string(),
    type: z.literal('installed'),
  }),
  z.object({
    id: z.string(),
    version: z.string(),
    type: z.literal('external'),
    name: z.string(),
    isPreloaded: z.literal(true),
    path: z.string(),
  }),
]);

const authSchema = z.object({
  authenticationType: z.string(),
});

const importMapOverridesSchema = z.object({
  enableUI: z.boolean().optional(),
  allowedSources: z.array(z.string()).optional(),
});

const devtoolsSchema = z.object({
  importMapOverrides: importMapOverridesSchema.optional(),
});

const librariesSchema = z.object({
  basePrefix: z.string(),
});

const pluginSchema = z.object({
  enabled: z.boolean(),
  route: z.string(),
  auth: authSchema.optional(),
});

const widgetConfigSchema = z.object({
  widgetId: z.string(),
  type: z.string().optional(),
  plugin: pluginSchema,
});

const widgetsSchema = z.object({
  basePrefix: z.string(),
  configs: z.array(widgetConfigSchema),
});

const platformConfigSchema = z.object({
  devtools: devtoolsSchema.optional(),
  browserslistConfig: z.array(z.string()),
});

export const dynamicConfigSchema = z.object({
  libraries: librariesSchema,
  widgets: widgetsSchema,
  platform: platformConfigSchema,
});
