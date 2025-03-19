import ky, { type Options } from 'ky';
import { getBaseConfig, getConfig } from '../config/getConfig';
import { onefeProgram } from '../../oneFeProgram/oneFeProgram';
import { OneFeBaseConfigObject } from '../config/config.types';

export async function getOneFeApi() {
  const environment = onefeProgram.getOptionValue('environment');
  const config = await getConfig();

  const baseConfig = config.baseConfig as OneFeBaseConfigObject;

  const { serverBaseUrl, shellBaseUrl } = (await getBaseConfig()).environments[
    environment
  ];

  const commonOptions: Options = {
    retry: {
      backoffLimit: 1000,
    },
  };

  const server = ky.extend({
    ...commonOptions,
    prefixUrl: serverBaseUrl,
  });

  const shell = ky.extend({
    ...commonOptions,
    prefixUrl: shellBaseUrl,
  });

  return {
    server,
    shell,
  };
}
