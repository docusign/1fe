import { memoize } from 'lodash';
import { getBaseConfigForEnv } from '../config/getBaseConfigForEnv';
import { getCommonConfigs } from '../config/getCommonConfigs';

export const getKnownUris = memoize(async (environment: string) => {
  const { serverBaseUrl } = await getBaseConfigForEnv(environment);
  const commonConfig = await getCommonConfigs(environment);

  return {
    version: `${serverBaseUrl}/version`,
    getWidgetBaseCdnUrl(widgetId: string, widgetVersion: string) {
      return `${commonConfig.cdn.widgets.basePrefix}${widgetId}/${widgetVersion}`;
    },
  };
});
