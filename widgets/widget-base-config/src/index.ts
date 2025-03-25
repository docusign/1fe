import { OneFeCommonConfig, OneFeBaseConfiguration } from '@devhub/cli';

import ky from 'ky';

export const getBaseConfig: OneFeBaseConfiguration = async () => {
  const commonConfig = await ky
    .get(
      'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/integration.json',
    )
    .json<OneFeCommonConfig>();

  return {
    environments: {
      integration: {
        commonConfig,
        shellBaseUrl: 'https://example.com', // Add the appropriate URL here
        serverBaseUrl: 'https://example.com', // Add the appropriate URL here
      },
    },
    baththubUrl: '',
  };
};
