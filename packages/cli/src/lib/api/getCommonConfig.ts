import { onefeProgram } from '../../oneFeProgram/oneFeProgram';
import { getBaseConfig } from '../config/getConfig';
import { CommonConfig } from '../types/commonConfigType';
import ky from 'ky';

export async function getCommonConfig() {
  const baseConfig = await getBaseConfig();
  const env = onefeProgram.getOptionValue('environment');

  const { commonConfigsUrl } = baseConfig.environments[env];

  return ky.get(commonConfigsUrl).json<CommonConfig>();
}
