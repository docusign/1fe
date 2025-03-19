import { z } from 'zod';

export const variantConfigSchema = z.object({
  'schema-version': z.string(),
  variantId: z.string(),
});

export type OneFeVariantConfig = z.infer<typeof variantConfigSchema>;
