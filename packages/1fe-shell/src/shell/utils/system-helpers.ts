import { ONEDS_SHELL_IMPORT_MAP_ID } from '../constants/platform-props';
import { PlatformPropsType } from '../types/platform-utils';

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

export const platformProps = {} as PlatformPropsType;
