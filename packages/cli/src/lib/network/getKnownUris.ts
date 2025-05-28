import { memoize } from 'lodash';
import { getBaseConfigForEnv } from '../config/getBaseConfigForEnv';
import { getDynamicConfigs } from '../config/getDynamicConfigs';

export const getKnownUris = memoize(async (environment: string) => {
  const { serverBaseUrl } = await getBaseConfigForEnv(environment);
  const dynamicConfig = await getDynamicConfigs(environment);

  return {
    version: `${serverBaseUrl}/version`,
    getWidgetBaseCdnUrl(widgetId: string, widgetVersion: string) {
      return `${dynamicConfig.widgets.basePrefix}${widgetId}/${widgetVersion}`;
    },
  };
});
