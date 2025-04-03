// import { getWidgetProjectSrcTypesPath } from '../paths';
import { getKnownPaths } from '../paths/getKnownPaths';
import { FileSystem } from './files';
import { updateKnownWidgetsFile } from './registry';
import type { InstallContractResult, WidgetId } from './types';

/**
 * Removes a contract type declaration file from the project
 * @param projectSrcTypesPath - Full path to project src/types folder
 * @param widgetId - The widgetId whose contract will be removed
 * @returns
 */
export async function removeContract(
  widgetId: WidgetId,
): Promise<InstallContractResult> {
  const projectSrcTypesPath = getKnownPaths().contracts.typesDir;

  const fileSystem = new FileSystem(projectSrcTypesPath);
  const isRemoved = await fileSystem.removeWidgetContract(widgetId);

  if (!isRemoved) {
    return {
      type: 'WidgetNotFoundResult',
      widgetId,
    };
  }

  await updateKnownWidgetsFile(fileSystem);

  return {
    type: 'WidgetContractRemoved',
    widgetId,
  };
}
