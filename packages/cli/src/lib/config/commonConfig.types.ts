import { z } from 'zod';
import { commonConfigSchema } from './commonConfigSchema';

export type OneFeCommonConfig = z.infer<typeof commonConfigSchema>;
