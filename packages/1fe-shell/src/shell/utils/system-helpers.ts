import { DYNAMIC_CONFIGS, WIDGET_CONFIGS } from '../configs/config-helpers';
import { ONEDS_SHELL_IMPORT_MAP_ID } from '../constants/platform-props';
import { getPlatformProps } from '../platformProps';
import { PlatformPropsType } from '../types/platform-utils';
import { WidgetConfig } from '../types/widget-config';
import { getShellLogger } from './telemetry';
import { TreeNode, widgetContextDependencyTree } from './tree';
import { isAllowedSource } from './widget-url-overrides';

const logger = getShellLogger();
// TODO: BK to come back and merge the two trees
// 1. system-helpers.ts
// 2. getPlatformUtils.ts
const CONTEXT_IMPORT_NAME = '1dsContext';
const INTERNAL_CONTEXT_REF = Symbol('1dsContext');

/**
 * For cases when we use System.import to load a widget directly from a url
 * such as Bathtub's widget.get or when we are loading a pinned widget
 * we need to determine if we know this widget and if so then reuse the existing widget config.
 * We will override the version with the version from the url.
 *
 * DRAGON: This is a point in time hack and should be refactored. Things like the runtime config
 * of the specific version of the widget etc, aren't being handled here.
 *
 * NOTE: exported for unit testing
 */
export const hackyWidgetIdDetermination = (url: string) => {
  // If the url is not a docusign cdn url then skip.
  // This to prevent any security issues.
  if (!isAllowedSource(url, DYNAMIC_CONFIGS.importMapOverrides.allowedSources)) {
    return;
  }

  const template = /1ds\/widgets\/(.*?)\/js\/1ds-bundle.js/i;
  const match = url.match(template);
  if (!match || match.length < 2) {
    return;
  }

  // Mostly at this point we should see a name such as "@org/widget-name/version"
  const mayBeWidgetName = match[1];
  const parts = mayBeWidgetName.split('/');
  if (parts.length < 3) {
    return;
  }

  const [org, widgetName, version] = parts;
  const widgetId = `${org}/${widgetName}`;
  const mayBeWidget = WIDGET_CONFIGS.get(widgetId);
  if (!mayBeWidget) {
    return;
  }

  console.log(
    `[1DS-Context] Best case effort for pinned widget:${widgetId}, version:${version} from url ${url}`,
  );

  return {
    ...mayBeWidget,
    version: version,
  };
};

export const addScopedImportMapForPlatformProps = (
  widgetId: string,
  platformProps: PlatformPropsType,
) => {
  // Create a unique identifier for the platform props requested by this widgetId
  const scopedPlatformPropsIdentifier = `${ONEDS_SHELL_IMPORT_MAP_ID}::${widgetId}`;
  // Add the scoped import map with this unique identifier short-circuiting the generic libraryId to the import map

  // Dynamically set the unique identifier for this widgetId to return the contextually created platformProps
  System.set(scopedPlatformPropsIdentifier, {
    __esModule: true,
    platformProps,
  });
};

/**
 * exported for unit testing
 */
export const injectScopedWidgetContext = (
  requestedBy: TreeNode<WidgetConfig>,
): string => {
  let platformProps;
  const existingContext = Object.getOwnPropertyDescriptor(
    requestedBy,
    INTERNAL_CONTEXT_REF,
  );

  // If we have already injected the context for this widget
  // then we can skip re-creating the context and just return the existing context
  // This happens during HMR or when the same widget is loaded multiple times
  if (existingContext?.value) {
    platformProps = existingContext.value;
  } else {
    platformProps = getPlatformProps(requestedBy.data);

    // Track the context as a hidden property on the node.
    // This way if we want to do further dynamic injections post initial load
    // We can use this to modify the context. Eg, modifying the language setting
    // of all widgets
    Object.defineProperty(requestedBy, INTERNAL_CONTEXT_REF, {
      value: platformProps,
    });
  }

  // Resolve the bare module specifier in CONTEXT_IMPORT_NAME to the scoped url.
  const scopeId = `oneds://${requestedBy.data.widgetId}/${requestedBy.id}`;
  System.set(scopeId, {
    __esModule: true,
    platformProps,
  });

  return scopeId;
};

/**
 * exported for unit testing
 */
export const tryGetParentTreeNode = (
  url: string | undefined,
): TreeNode<WidgetConfig> | undefined => {
  if (!url) {
    return;
  }
  // Get the parent widget that is requesting the context
  const requestedBy = widgetContextDependencyTree.getByKey(url);
  if (!requestedBy) {
    // This only happens if somehow we are being asked to resolve a context for a widget
    // that is not in our platform or not even loaded yet.
    logger.error({
      message: "[1DS-Injection] Couldn't find parent widget for url",
      url,
    });
    return;
  }
  return requestedBy;
};

/**
 * This function patches the SystemJS resolve hook to inject the context for the widget that is requesting it.
 * This is done by checking if the import name is the context import name and if so then we inject the context
 * for the widget that is requesting it.
 */
export const patchSystemJSResolve = () => {
  const SYSTEMJS_PROTOTYPE = System.constructor.prototype;
  const existingHook = SYSTEMJS_PROTOTYPE.resolve;
  SYSTEMJS_PROTOTYPE.resolve = function oneDsResolver(
    importName: string,
    requestedByUrl: string | undefined,
  ) {
    // Get the parent widget that is requesting the context
    const requestedBy = tryGetParentTreeNode(requestedByUrl);

    // If the import name is the context import name then we need to inject the context
    // for the widget that is requesting it.
    if (importName === CONTEXT_IMPORT_NAME) {
      if (!requestedBy) {
        // Can't inject the context if we don't know who is requesting it
        return;
      }

      // Inject the context for the widget that is requesting it
      // This remaps the bare module specifier to a uri that is scoped to the widget
      const scopeId = injectScopedWidgetContext(requestedBy);
      return scopeId;
    }

    // Invoke the original resolve hook from SystemJS and get the resolved url
    // This accounts for import maps and other things that SystemJS does
    const resolvedUrl: string = existingHook.call(
      this,
      importName,
      requestedByUrl,
    );
    const mayBeExistingNode = widgetContextDependencyTree.getByKey(resolvedUrl);

    // Check if we have tracked this url in our platform
    if (!mayBeExistingNode) {
      // Check if we have a widget with this import name
      let mayBeWidget = WIDGET_CONFIGS.get(importName);

      // HACK: This is a hack to handle the case where we are trying to resolve a url to a widget
      if (!mayBeWidget) {
        mayBeWidget = hackyWidgetIdDetermination(importName);
      }

      if (!mayBeWidget) {
        console.log(
          `[1DS-Context] Couldn't find configuration for url ${resolvedUrl}. Treating as a library.`,
        );

        // Creating a fake import.
        // This scenario occurs when the url is not a widget
        // or if the url is a dependency that we haven't externalized ourselves
        // or if someone uses the getByUrl to load anything
        mayBeWidget = {
          widgetId: importName,
          // _url: resolvedUrl,
          version: 'latest',
          // activePhasedDeployment: false,
          runtime: {},
        };
      }

      // Whatever the case may be, we add the resolved url to our platform
      // so that we can track it and also return the resolved url
      widgetContextDependencyTree.add(
        resolvedUrl,
        mayBeWidget,
        'library', // This is incorrect since everything is being treated as a library.
        requestedBy,
      );
    }

    // If not the dependency could be something that we don't care about
    // or it could be something like react etc. Whatever it is we don't want to
    // mess with it so we just return it as is.
    return resolvedUrl;
  };

  // Return a function that can be used to unpatch the resolve hook
  return () => {
    SYSTEMJS_PROTOTYPE.resolve = existingHook;
  };
};

export const platformProps = {} as PlatformPropsType;
