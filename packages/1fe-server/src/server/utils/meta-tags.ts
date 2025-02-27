import { PluginConfig, WidgetConfigs } from '../types';

/**
 * Detects the presence of any og tags
 *
 * @param tags - An array of meta tags
 * @returns true if any og meta tags are present, otherwise false
 */
export const isOgTagged = (tags: Record<string, string>[]) => {
  return tags.some(
    (tag: Record<string, string>) =>
      tag.property && tag.property.startsWith('og:'),
  );
};

/**
 * Get meta tags from a widget's runtime config
 * If the widget does not have a runtime config, return the default meta tags
 *
 * @param widgetConfigs - The widget configs
 * @param plugin - The current plugin that is to be rendered
 * @returns The meta tags for the plugin
 */
export const getMetaTagsFromWidgetRuntimeConfig = (
  widgetConfigs: WidgetConfigs,
  plugin: PluginConfig,
): Record<string, string>[] => {
  if (!plugin) {
    // meta tags do not exist for non /index.html routes
    // so we need to check if the plugin is available first and default to defaultMetaTags internally
    return [];
  }

  const associatedWidget = widgetConfigs.get(plugin.widgetId);

  if (!associatedWidget || !associatedWidget?.runtime?.plugin?.metaTags) {
    return [];
  }
  if (isOgTagged(associatedWidget.runtime.plugin.metaTags)) {
    return associatedWidget.runtime.plugin.metaTags;
  }

  return associatedWidget.runtime.plugin.metaTags;
};

/**
 * Get meta tag strings from a widget's runtime config
 * If the widget does not have a runtime config, return the default meta tags
 *
 * This function returns an array of strings that can be used in the HTML head tag
 *
 * @param widgetConfigs
 * @param plugin
 * @returns string[] This function returns an array of strings that can be used in the HTML head tag
 */
export const getMetaTagStringsFromWidgetRuntimeConfig = (
  widgetConfigs: WidgetConfigs,
  plugin: PluginConfig,
): string[] => {
  const metaTags = getMetaTagsFromWidgetRuntimeConfig(widgetConfigs, plugin);

  const tagsToReturn = metaTags.map((metaTag) => {
    return Object.entries(metaTag)
      .map(([key, value]) => {
        return `${key}="${value}"`;
      })
      .join(' ');
  });
  return tagsToReturn;
};
