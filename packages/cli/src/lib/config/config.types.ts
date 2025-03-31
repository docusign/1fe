import { z } from 'zod';
import {
  baseConfigSchema,
  onefeConfigurationSchema,
  baseConfigObjectSchema,
  runtimeConfigSchema,
  environmentSchema,
  widgetSchema,
  pinnedWidgetSchema,
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

export type OneFeEnvironmentObject = z.infer<typeof environmentSchema>;
export type OneFeRuntimeConfigObject = z.infer<typeof runtimeConfigSchema>;

export type TypedOneFeBaseConfigurationObject<Environments extends string> =
  Omit<OneFeBaseConfigurationObject, 'environments'> & {
    environments: Record<Environments, OneFeEnvironmentObject>;
  };

export type TypedOneFeBaseConfig<Environments extends string> =
  | string
  | TypedOneFeBaseConfigurationObject<Environments>
  | (() => Promise<TypedOneFeBaseConfigurationObject<Environments>>);

export type TypedOneFeConfiguration<Environments extends string> = Omit<
  OneFeConfiguration,
  'baseConfig' | 'runtimeConfig'
> & {
  baseConfig: TypedOneFeBaseConfig<Environments>;
  runtimeConfig: Record<Environments, OneFeRuntimeConfigObject>;
};

export type Widget = z.infer<typeof widgetSchema>;
export type PinnedWidget = z.infer<typeof pinnedWidgetSchema>;
