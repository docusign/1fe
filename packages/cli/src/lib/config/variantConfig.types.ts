import { z } from 'zod';

export const variantConfigSchema = z.object({
  variantId: z.string(),
});

export type OneFeVariantConfig = z.infer<typeof variantConfigSchema>;
