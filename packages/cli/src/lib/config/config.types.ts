import { z } from 'zod';
import {
  baseConfigSchema,
  onefeConfigurationSchema,
  baseConfigObjectSchema,
} from './configSchema';

export type OneFeConfiguration = z.infer<typeof onefeConfigurationSchema>;
export type OneFeBaseConfiguration = z.infer<typeof baseConfigSchema>;

export type OneFeBaseConfigurationObject = z.infer<
  typeof baseConfigObjectSchema
>;
export type OneFeConfigurationObject = Omit<
  OneFeConfiguration,
  'baseConfig'
> & {
  baseConfig: OneFeBaseConfigurationObject;
};
