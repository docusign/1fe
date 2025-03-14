export const PINNED_WIDGET_TYPE = 'pinned' as const;
export const SYSTEM_WIDGET_TYPE = 'system' as const;

/**
 * **IMPORTANT - MAKING CHANGES TO THIS OBJECT WILL BREAK 1FE.**
 * **DO NOT CHANGE WITHOUT A STRONG ROLL-OUT PLAN.**
 *
 * The keys used in the widget module object to define the widget and its variants.
 * only used for widgets with variants.
 */
export const WIDGET_MODULE_KEYS = {
  /**
   * this key indicates that the widget has variants. It is always going to be `true` for now.
   */
  hasVariants: '__hasVariants',

  /**
   * The key that holds the array of variant ids for the widget.
   */
  variants: '__variants',

  /**
   * The key that holds the function that returns the widget.
   */
  getWidget: '__getWidget',

  /**
   * The key that holds the function that returns the variant.
   */
  getVariant: '__getVariant',
} as const;
