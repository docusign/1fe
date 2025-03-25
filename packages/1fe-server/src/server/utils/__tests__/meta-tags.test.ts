import {
  getMetaTagsFromWidgetRuntimeConfig,
  getMetaTagStringsFromWidgetRuntimeConfig,
  isOgTagged,
} from '../meta-tags';
import { generateWidgetConfigMap } from '../widget-config-helpers';

const defineWidgetConfigs = (
  widgetId = 'widgetId',
  version = '1.2.3',
  activePhasedDeployment = false,
  runtime = {},
) => ({ widgetId, version, activePhasedDeployment, runtime });

describe('isOgTagged', () => {
  it('should return true if any og meta tags are present', () => {
    const tags = [{ property: 'og:title', content: 'title' }];
    expect(isOgTagged(tags)).toBe(true);
  });

  it('should return false if no og meta tags are present', () => {
    const tags = [{ content: 'title' }];
    expect(isOgTagged(tags)).toBe(false);
  });
});

describe('getMetaTagsFromWidgetRuntimeConfig', () => {
  it('should return the default meta tags if the widget does not have a runtime config', () => {
    const widgetConfigs = generateWidgetConfigMap([defineWidgetConfigs()]);

    const plugin = { widgetId: 'widgetId', enabled: true, route: '/route' };
    expect(getMetaTagsFromWidgetRuntimeConfig(widgetConfigs, plugin)).toEqual(
      [],
    );
  });

  it('should return the meta tags from the widget runtime config with defaultOG tags if no og tags are present', () => {
    const widgetConfigs = generateWidgetConfigMap([
      {
        widgetId: 'widgetId',
        version: '1.2.3',
        activePhasedDeployment: false,
        runtime: {
          plugin: {
            metaTags: [
              { name: 'description', content: 'widget description' },
            ] as Record<string, string>[],
          },
        },
      },
    ]);

    const plugin = { widgetId: 'widgetId', enabled: true, route: '/route' };

    expect(getMetaTagsFromWidgetRuntimeConfig(widgetConfigs, plugin)).toEqual([
      { name: 'description', content: 'widget description' },
    ]);
  });

  it('should return the meta tags from the widget runtime config with no default OG tags if og tags are present', () => {
    const widgetConfigs = generateWidgetConfigMap([
      {
        widgetId: 'widgetId',
        version: '1.2.3',
        activePhasedDeployment: false,
        runtime: {
          plugin: {
            metaTags: [
              { name: 'description', content: 'widget description' },
              {
                property: 'og:description',
                content: 'This widget is described',
              },
            ] as Record<string, string>[],
          },
        },
      },
    ]);

    const plugin = { widgetId: 'widgetId', enabled: true, route: '/route' };

    expect(getMetaTagsFromWidgetRuntimeConfig(widgetConfigs, plugin)).toEqual([
      { name: 'description', content: 'widget description' },
      {
        property: 'og:description',
        content: 'This widget is described',
      },
    ]);
  });
});

describe('getMetaTagStringsFromWidgetRuntimeConfig', () => {
  it('should return an array of strings that can be used in the HTML head tag', () => {
    const widgetConfigs = generateWidgetConfigMap([
      {
        widgetId: 'widgetId',
        version: '1.2.3',
        activePhasedDeployment: false,
        runtime: {
          plugin: {
            metaTags: [
              {
                nameggsd: 'description757575',
                contentdasda: 'widget description',
              },
            ],
          },
        },
      },
    ]);

    const plugin = { widgetId: 'widgetId', enabled: true, route: '/route' };
    expect(
      getMetaTagStringsFromWidgetRuntimeConfig(widgetConfigs, plugin),
    ).toEqual([
      'nameggsd="description757575" contentdasda="widget description"',
    ]);
  });
});
