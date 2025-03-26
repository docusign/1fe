import { Page } from '@playwright/test';

// import { HostedEnvironment } from '@1ds/helpers/types';
// import { WidgetConfig } from '../../isomorphic/types/widgetConfigs.types';
// import { EnvConfig } from '../../types';
// import { ClientFeatureFlags } from '../../types/featureFlags';

// export const ONE_DS_QE_PROD_ENVIRONMENTS: (typeof environment.environmentName)[] =
//   ['demo:1ds', 'production:1ds'];

// /**
//  *
//  * @param page
//  * @param configName
//  * @returns configs from the <head /> of the page, e.g. the EnvConfig
//  */
// export const getOneDSConfigFromPage = async <T>(
//   page: Page,
//   configName: string,
// ): Promise<T> => {
//   return await page.evaluate((configName) => {
//     const oneDsConfig =
//       JSON.parse(
//         document?.querySelector(`script[data-1ds-config-id="${configName}"]`)
//           ?.innerHTML || '[]',
//       ) ?? [];
//     return oneDsConfig;
//   }, configName);
// };

/**
 * Extracts widget config from the DOM using the widget.frame div that surrounds the mounted widget
 * @param page
 * @param widgetId
 * @returns
 */
export const getWidgetConfigFromPage = async (
  page: Page,
  widgetId: string,
): Promise<any> => {
  return await page.evaluate(async (widgetId: string) => {
    const widgetConfigs = document?.querySelector(
      `script[type="application/json"][data-1fe-config-id="widget-config"]`,
    );

    try {
      const widgetConfig = JSON.parse(widgetConfigs?.innerHTML || '[]');
      const widgetConfigForId = widgetConfig.find(
        (config: any) => config.widgetId === widgetId,
      );
      return widgetConfigForId;
    } catch (error) {
      throw new Error(
        `Could not parse widget-config from the DOM for widgetId: ${widgetId}`,
      );
    }
  }, widgetId);
};

// export const isProdEnvironmentRun = ['production', 'demo'].includes(
//   process.env.NODE_ENV?.toLowerCase() || 'production',
// );

// export const isIntegrationEnvironmentRun = [
//   'development',
//   'integration',
// ].includes(process.env.NODE_ENV?.toLowerCase() || 'production');

// export const getEnvConfigFromDom = async (page: Page): Promise<any> => {
//   const envConfig = await page.evaluate(
//     () =>
//       JSON.parse(
//         document?.querySelector(`script[data-1ds-config-id="env-config"]`)
//           ?.innerHTML ?? '{}',
//       ) as any,
//   );

//   return envConfig;
// };

// export const getEnvironmentFromDom = async (
//   page: Page,
// ): Promise<HostedEnvironment> => {
//   const envConfig = await getEnvConfigFromDom(page);
//   return envConfig.ENVIRONMENT;
// };

// export const getFeatureFlagsFromDom = async (
//   page: Page,
// ): Promise<ClientFeatureFlags> => {
//   const envConfig = await getEnvConfigFromDom(page);
//   return envConfig.FEATURE_FLAGS;
// };
