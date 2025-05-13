import { OneFeCommonConfig, OneFeBaseConfigurationObject } from '@1fe/cli';

import ky from 'ky';

const environments = ['development', 'integration', 'production'] as const;

export type Environments = (typeof environments)[number];

const configUrls: Record<Environments, string> = {
  development:
    'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/development.json',
  integration:
    'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/integration.json',
  production:
    'https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/production.json',
};

function getCommonConfig(env: Environments) {
  return ky.get(configUrls[env]).json<OneFeCommonConfig>();
}

export async function getBaseConfig(): Promise<OneFeBaseConfigurationObject> {
  const baseConfig: OneFeBaseConfigurationObject = {
    environments: {},
    bathtubUrl: 'http://localhost:3001/bathtub',
  };

  for (const env of environments) {
    baseConfig.environments[env] = {
      commonConfig: await getCommonConfig(env),
      shellBaseUrl: 'http://localhost:3001',
      serverBaseUrl: 'http://localhost:3001',
    };
  }

  return baseConfig;
}
