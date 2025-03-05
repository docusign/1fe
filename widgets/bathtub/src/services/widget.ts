import { z } from 'zod';

import { Environment, getWidgetCdnUrl } from './cdn';
import { downloadWidgetVersions, PluginAuth } from './version';
import {
  downloadWidgetActivity,
  WidgetActivity,
  WidgetEnvironmentActivity,
} from './widgetActivity';

const WidgetBundle = WidgetEnvironmentActivity.extend({
  bundleUrl: z.string().url().optional(),
  configUrl: z.string().url(),
});

type WidgetBundle = z.infer<typeof WidgetBundle>;

export const Widget = WidgetActivity.extend({
  widgetId: z.string(),
  lastModified: z.object({
    integration: WidgetBundle.optional(),
    stage: WidgetBundle.optional(),
    demo: WidgetBundle.optional(),
    production: WidgetBundle.optional(),
  }),
  widgetDependencies: z.array(z.string()),
  pinnnedWidgetDependencies: z.array(z.string()),
  variants: z.array(z.string()),
  auth: PluginAuth.optional(),
  route: z.string().optional(),
  isPlugin: z.boolean().default(false),
});

export type Widget = z.infer<typeof Widget>;

const getConfigUrl = (widgetId: string, environment: Environment) => {
  const normalizedWidgetId = widgetId.replace('/', '-');
  return `https://cdn.com`;
};

const envToCheck = ['integration', 'stage', 'demo', 'production'] as const;

export const getWidgets = async (): Promise<Widget[]> => {
  try {
    const [versions, activity] = await Promise.all([
      downloadWidgetVersions(),
      downloadWidgetActivity(),
    ]);

    const versionByWidgetId = new Map(
      versions.configs.widgetConfig.map((c) => {
        return [c.widgetId, c];
      }),
    );

    const widgets = Object.keys(activity)
      .map((widgetId) => {
        const widgetActivity = activity[widgetId];
        const widgetVersion = versionByWidgetId.get(widgetId);

        if (!widgetVersion) {
          console.error(`No version found for widget ${widgetId}`);
          return;
        }

        const merged = {
          ...widgetActivity,
          widgetId: widgetId,
          widgetDependencies:
            widgetVersion.runtime.dependsOn?.widgets?.map((w) => w.widgetId) ??
            [],
          pinnnedWidgetDependencies:
            widgetVersion.runtime.dependsOn?.pinnedWidgets?.map(
              (w) => `${w.widgetId}@${w.version}`,
            ) ?? [],
          variants: [],
          auth: widgetVersion.plugin?.auth,
          route: widgetVersion.plugin?.route,
          isPlugin: widgetVersion.plugin != null,
        } as Widget;

        envToCheck.forEach((env) => {
          if (merged.lastModified?.[env]) {
            merged.lastModified[env] = {
              ...merged.lastModified[env],
              bundleUrl: merged.lastModified[env]?.widgetVersion
                ? getWidgetCdnUrl(
                    widgetId,
                    merged.lastModified[env]?.widgetVersion,
                    '1fe-bundle',
                    env,
                  )
                : undefined,
              configUrl: getConfigUrl(widgetId, env),
            };
          }
        });

        return Widget.parse(merged);
      })
      .filter(Boolean) as Widget[];

    console.log(`loaded ${widgets.length} widgets`);
    return widgets;
  } catch (err) {
    console.error({
      message: 'Failed to load widgets',
      err,
    });

    throw new Error('Failed to load widgets');
  }
};
