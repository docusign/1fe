import { z } from 'zod';

const managedSchema = z.union([
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
  enableUI: z.boolean(),
  allowedSources: z.array(z.string()),
});

const librariesSchema = z.object({
  basePrefix: z.string(),
  managed: z.array(managedSchema),
});

const pluginSchema = z.object({
  enabled: z.boolean(),
  route: z.string(),
  auth: authSchema.optional(),
});

const releaseConfigSchema = z.object({
  widgetId: z.string(),
  type: z.string().optional(),
  plugin: pluginSchema,
  version: z.string(),
});

const widgetsSchema = z.object({
  basePrefix: z.string(),
  releaseConfig: z.array(releaseConfigSchema),
});

const cdnSchema = z.object({
  libraries: librariesSchema,
  widgets: widgetsSchema,
});

export const commonConfigSchema = z.object({
  cdn: cdnSchema,
  importMapOverrides: importMapOverridesSchema,
  browserslistConfig: z.array(z.string()),
});
