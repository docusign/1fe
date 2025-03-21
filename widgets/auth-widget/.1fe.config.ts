import { OneFeConfiguration } from '@devhub/cli';
import { getBaseConfig } from '@repo/widget-base-config'; // this is the redistributed package for the organization

const confiugration: OneFeConfiguration = {
  baseConfig: getBaseConfig,
};

export default confiugration;
