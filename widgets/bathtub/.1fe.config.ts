import { OneFeRuntimeConfigObject, TypedOneFeConfiguration } from '@devhub/cli';
import { Environments, getBaseConfig } from '@repo/widget-base-config'; // this is the redistributed package for the organization

const commonRuntimeConfig: OneFeRuntimeConfigObject = {
  dependsOn: {
    widgets: [
      {
        widgetId: '@1fe/starter-kit',
      },
    ],
  },
};

const configuration: TypedOneFeConfiguration<Environments> = {
  baseConfig: getBaseConfig,
  runtimeConfig: {
    development: commonRuntimeConfig,
    integration: commonRuntimeConfig,
    production: commonRuntimeConfig,
  },
};

export default configuration;
