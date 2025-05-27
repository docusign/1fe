import { memoize } from 'lodash';
import { getBaseConfigForEnv } from '../config/getBaseConfigForEnv';
import { getDynamicConfigs } from '../config/getDynamicConfigs';

export const getKnownUris = memoize(async (environment: string) => {
  const { serverBaseUrl } = await getBaseConfigForEnv(environment);
  const dynamicConfig = await getDynamicConfigs(environment);

  // separate-config-cleanup
  const tempUrl =
    'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/integration/widgets/';
  return {
    version: `${serverBaseUrl}/version`,
    getWidgetBaseCdnUrl(widgetId: string, widgetVersion: string) {
      return `${tempUrl}${widgetId}/${widgetVersion}`;
    },
  };
});
