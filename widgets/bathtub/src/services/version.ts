import { z } from 'zod';

import { Environment } from './cdn';

const Package = z.object({
  id: z.string(),
  version: z.string(),
  name: z.string().optional(),
});

export const PluginAuth = z.object({
  secretKeyName: z.string().optional(),
  clientAppId: z.string(),
  authenticationType: z.string(),
  scopes: z.array(z.string()),
  generateAuthTxnId: z.boolean().default(false),
  callbackUrl: z.string().url().optional(),
  logoutUrl: z.string().url().optional(),
  authCookiesToClear: z.array(z.string()).optional(),
  useNativeAuth: z.boolean().optional(),
  ramp1FEAuthPercent: z.number().optional(),
});
export type PluginAuth = z.infer<typeof PluginAuth>;

const Plugin = z.object({
  enabled: z.boolean().optional(),
  route: z.string().optional(),
  auth: PluginAuth.optional(),
});

const Runtime = z.object({
  preload: z
    .array(
      z.object({
        apiGet: z.string().optional(),
        widget: z.string().optional(),
      }),
    )
    .optional(),
  dependsOn: z
    .object({
      widgets: z
        .array(
          z.object({
            widgetId: z.string(),
          }),
        )
        .optional(),
      pinnedWidgets: z
        .array(
          z.object({
            widgetId: z.string(),
            version: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),

  headers: z.record(z.string(), z.string()).optional(),
});

export const WidgetConfig = z.object({
  widgetId: z.string(),
  plugin: Plugin.optional(),
  version: z.string(),
  activePhasedDeployment: z.boolean(),
  runtime: Runtime,
  type: z.string().optional(),
});
export type WidgetConfig = z.infer<typeof WidgetConfig>;

const WidgetVersionData = z.object({
  environment: z.string(),
  version: z.string(),
  nodeVersion: z.string(),
  buildNumber: z.string(),
  branch: z.string(),
  gitSha: z.string(),
  packages: z.object({
    externals: z.array(Package),
    installed: z.array(Package.omit({ name: true })),
  }),
  configs: z.object({
    widgetConfig: z.array(WidgetConfig),
  }),
});
export type WidgetVersionData = z.infer<typeof WidgetVersionData>;

const EnvironmentUrls: Record<Environment, string> = {
  development: 'http://localhost:8080',
  integration: 'https://apps.dev.docusign.net',
  stage: 'https://apps-s.docusign.com',
  demo: 'https://apps-d.docusign.com',
  production: 'https://apps.docusign.com',
};

export const downloadWidgetVersions = async (): Promise<WidgetVersionData> => {
  try {
    const res = await (
      await fetch(`${EnvironmentUrls['integration']}/version`, {
        // TODO
        method: 'GET',
      })
    ).json();

    return WidgetVersionData.parse(res);
  } catch (err) {
    console.error({
      message: `Failed to download widget versions: ${err}`,
      error: err,
    });
    throw err;
  }
};
