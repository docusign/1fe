import { z } from 'zod';
import { dynamicConfigSchema } from './dynamicConfigSchema';

export type OneFeDynamicConfig = z.infer<typeof dynamicConfigSchema>;
