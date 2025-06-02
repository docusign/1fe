import { DeepReadonly } from 'deep-freeze';
import { WidgetTreeNode } from './tree';
import { EventBusPlatformUtils } from '../platformProps/utils/event-bus/types';
import { SessionStoragePlatformUtils } from '../platformProps/utils/sessionStorage';
import { LocalStoragePlatformUtils } from '../platformProps/utils/localStorage';
import { initExperience } from '../platformProps/utils/experience';
import { WidgetAppLoadTimeUtils } from './app-load-time';

export type ExperienceUtils = ReturnType<typeof initExperience>;

export interface KnownWidgets {}
export interface KnownVariants {}
export type UnknownWidgetContract = Record<string, unknown>;

export type WidgetProps = KnownWidgets & {
  [unknownId: string]: UnknownWidgetContract;
};

export type VariantProps = KnownVariants & {
  [widgetId: string]: {
    [variantId: string]: UnknownWidgetContract;
  };
};

export type WidgetNavigation = {
  // If a variantId is given, we want to look up the variantId in the VariantProps
  // If a variantId is not given, we want to look up the widgetId in the WidgetProps
  get: <
    TWidgetId extends string,
    TVariantId extends string | undefined = undefined,
    TWidgetProps = TVariantId extends string
      ? VariantProps[TWidgetId][TVariantId]
      : WidgetProps[TWidgetId],
  >(
    requestedWidgetId: TWidgetId,
    options?: {
      variantId?: TVariantId;
      Loader?: React.ReactNode;
    },
  ) => React.FC<TWidgetProps>;
  // getByUrl should not be defined here since this type is dynamically injected/inserted in widgets.
  // Widgets shouldn't know about the existence of this function.
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type PlatformUtils<CustomUtils = {}> = CustomUtils & {
  /**
   * Utilities for loading other widgets
   * Use the bathtub widget browser to find the widgetId you want to load
   *
   * Ensure they're available and deployed on the highest environment (Production) before consuming
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/widgets/
   */
  widgets: WidgetNavigation;
  /**
   * Utilities for measuring the time it takes for the widget to load
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/apploadtime/
   */
  appLoadTime: WidgetAppLoadTimeUtils;
  /**
   * Utilities for handling events and publishing/subscribing to the eventBus on the Shell
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/eventbus/
   */
  eventBus: EventBusPlatformUtils;
  /**
   * Utilities for handling session storage
   * Provides an interface to the browser's session storage via set, get, getAll, remove, size, and clear
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/sessionstorage/
   */
  sessionStorage: SessionStoragePlatformUtils;
  /**
   * Utilities for handling local storage
   * Provides an interface to the browser's local storage via set, get, getAll, remove, size, keys, and clear
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/localstorage/
   */
  localStorage: LocalStoragePlatformUtils;
  /**
   * Utilities for handling the 1FE shell experience
   *
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/experience/
   */
  experience: ExperienceUtils;
};

/**
 * Options parameter for the get method in the widgets utility
 */
export type WidgetOptions<TVariantId extends string = string> = {
  /**
   * The variantId to be used for the widget
   * defaults to the value `'default'`
   */
  variantId: TVariantId;

  /**
   * The loading animation to be used while loading the requested widget
   * defaults to the value Ink's ProgressCircle Spinner Component
   */
  Loader: React.ReactNode;
};

export type PlatformContextType = {
  /**
   * Who am I?
   */
  self: {
    widgetId: string;
    version: string;
    variantId?: string;
  };
  /**
   * *CAUTION: Writing logic specific to which parent widget loads you is **HIGHLY DISCOURAGED!***
   *
   * This utility function returns the immediate host of the calling widget
   * Useful for eventBus util implementation/targeting
   * @returns {WidgetTreeNode | null} - the parent widget
   */
  getHost: () => WidgetTreeNode | null;
  /**
   * This utility function returns a tree of the 1FE_SHELL at the root, it's plugin and widget as its children
   * @returns {WidgetTreeNode[]} - resultant tree reflecting the current state of the Shell
   */
  // getTree: () => WidgetTreeNode[];
  /**
   * There can only be one plugin mounted in the shell at a time.
   * This utility function returns the plugin mounted in the shell
   * @returns {WidgetTreeNode | null} - the plugin mounted in the shell
   */
  // getPlugin: () => WidgetTreeNode | null;
  /**
   * An alias for getTree()
   * @returns {WidgetTreeNode[]} - resultant tree reflecting the current state of the Shell
   */
  // yggdrasil: () => WidgetTreeNode[];
};

// export type PlatformRegistration = {
//   registerProvider: <P extends ProviderType>(
//     providerType: P,
//     providerImplementation: UtilProviders[P],
//   ) => void;
//   unregisterProvider: (providerType: ProviderType) => void;
// };

// eslint-disable-next-line @typescript-eslint/ban-types
export type PlatformPropsType<CustomUtils = {}> = DeepReadonly<{
  /**
   * The environment the 1FE SHELL is running in.
   *
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/ecosystem/deployment/environments/
   */
  environment: string;
  /**
   * The context of the widget's execution.
   * Some helpful information is provided here.
   */
  context: PlatformContextType;
  /**
   * Free utilities provided by the 1FE SHELL
   * All utilities are namespaced and unique to a widget loading inside the 1FE SHELL
   *
   * For a list of available utilities, see:
   * @link https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/
   */
  utils: PlatformUtils<CustomUtils>;
  /**
   * A providers registration object containing functions to register and unregister util implementation
   * overrides by plugins. Widgets mounted within plugins using overriden util implementations
   * will get those implementations rather than the ones provided by 1FE SHELL.
   */
  // providers?: PlatformRegistration;
}>;
