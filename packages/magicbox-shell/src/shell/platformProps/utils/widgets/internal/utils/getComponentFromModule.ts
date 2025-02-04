import { DEFAULT_WIDGET_OPTIONS } from './constants';
import { WidgetOptions } from '../../../../../types/platform-utils';
import { WIDGET_MODULE_KEYS } from '../../../../../constants/widgets';

export type GetComponentFromModuleParam = {
  options: Partial<WidgetOptions>;
  module: System.Module;
  log(message: string, otherData: Record<string, unknown>): void;
};

/**
 * Retrieves the component from the module based on the options passed.
 *
 * @param options - The options for retrieving the component.
 * @param module - The SystemJS module to retrieve the component from.
 * @param log - a function used to log events within.
 * @returns The component from the module based on the specified options.
 */
export async function getComponentFromModule({
  options: {
    variantId = DEFAULT_WIDGET_OPTIONS.variantId,
  } = DEFAULT_WIDGET_OPTIONS,
  module,
  log,
}: GetComponentFromModuleParam) {
  const isVariantWidget = module.default?.[WIDGET_MODULE_KEYS.hasVariants];
  const isRequestingDefaultVariant =
    variantId === DEFAULT_WIDGET_OPTIONS.variantId;

  const logSuccessfulGet = ({
    isVariantWidget,
    variantId,
    isRequestingDefaultVariant,
  }: {
    isVariantWidget?: boolean;
    variantId?: string;
    isRequestingDefaultVariant?: boolean;
  } = {}) =>
    log('[UTILS_API][WIDGETS] successful widgets.get call', {
      ...(isVariantWidget && { isVariantWidget }),
      ...(variantId && { variantId }),
      ...(isRequestingDefaultVariant && { isRequestingDefaultVariant }),
    });

  if (isVariantWidget) {
    if (isRequestingDefaultVariant) {
      logSuccessfulGet({
        isVariantWidget,
        isRequestingDefaultVariant,
        variantId,
      });
      return module.default[WIDGET_MODULE_KEYS.getWidget]();
    } else {
      logSuccessfulGet({ isVariantWidget, variantId });
      return module.default[WIDGET_MODULE_KEYS.getVariant](variantId);
    }
  }

  logSuccessfulGet();
  return module;
}
