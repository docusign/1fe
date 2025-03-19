import { OneFeConfiguration } from '@devhub/cli';

const confiugration: OneFeConfiguration = {
  baseConfig: {
    environments: {
      integration: {
        commonConfigsUrl:
          'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/integration.json',
      },
    },
  },
};

export default confiugration;
