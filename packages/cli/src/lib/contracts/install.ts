// import { HostedEnvironment } from '@1ds/helpers/types';
import { FileSystem } from './files';
import type { ContractUpgradeInfo, WidgetId } from './types';
import { findLiveContractVersion } from './versions';
// import {
//   getWidgetOneDSConfigPath,
//   getWidgetProjectSrcTypesPath,
// } from '../paths';
// import { getAndValidateOneDSConfigTs } from '../validations/one-ds-config/one-ds-config';
import { LiveVersions } from '../types/version';
import { getConfig } from '../config/getConfig';
import { getKnownPaths } from '../paths/getKnownPaths';
import { getLogger } from '../getLogger';

/**
 * Queries widget contracts for their latest available versions.
 * When widgetIds are defined, only those widgetIds will be upgraded.
 *
 * @param liveVersions - Current live versions to use
 * @param projectSrcTypesPath - Full path to project src/types folder
 * @param widgetIds - Optional widgetIds to limit upgrades to, else all
 * @returns A set of available widget contract upgrades
 */
export async function getCurrentWidgetContracts(
  liveVersions: LiveVersions,
): Promise<ContractUpgradeInfo[]> {
  const logger = getLogger('[cli][contracts][get]');
  // const oneDsConfigPath = getWidgetOneDSConfigPath();
  const projectSrcTypesPath = getKnownPaths().contracts.typesDir;

  // const parsedOneDSConfig = await getAndValidateOneDSConfigTs({
  //   oneDsConfigPath,
  // });

  // const runtimeConfig = parsedOneDSConfig.runtime;

  const { runtimeConfig } = await getConfig();

  const widgetIdsToAdd: Record<string, string | undefined> = {};

  // Locally we will always give integration version
  // TODO: Add code making all widget arrays the same across environments
  for (const environment in runtimeConfig) {
    const pinnedWidgets =
      runtimeConfig[environment]?.dependsOn?.pinnedWidgets || [];

    const widgets = runtimeConfig[environment]?.dependsOn?.widgets || [];

    widgets.forEach(
      (widget) =>
        (widgetIdsToAdd[widget.widgetId] = findLiveContractVersion(
          liveVersions!,
          widget.widgetId as WidgetId,
        )),
    );

    pinnedWidgets.forEach(
      (pinnedWidget) =>
        (widgetIdsToAdd[pinnedWidget.widgetId] = pinnedWidget.version),
    );
  }

  const fileSystem = new FileSystem(projectSrcTypesPath);

  await fileSystem.ensureWidgetContractsFiles();
  const installedWidgetContracts = await fileSystem.readWidgetContracts();

  const contractsToActOn = installedWidgetContracts.reduce(
    (accumulator, dependency) => {
      const {
        version: installedVersion,
        widgetId,
        variantId,
      } = dependency.header;

      // We only care about the main contract here
      if (variantId) {
        return accumulator;
      }

      if (!widgetIdsToAdd[widgetId]) {
        return [...accumulator, { widgetId, availableVersion: null }];
      }
      const availableVersion = widgetIdsToAdd[widgetId];
      delete widgetIdsToAdd[widgetId];

      return [...accumulator, { widgetId, availableVersion, installedVersion }];
    },
    [] as ContractUpgradeInfo[],
  );

  Object.keys(widgetIdsToAdd).forEach((widgetId) => {
    contractsToActOn.push({
      widgetId: widgetId as WidgetId,
      availableVersion: widgetIdsToAdd[widgetId],
    });
  });

  logger.debug('Acting on these contracts - ', contractsToActOn);

  return contractsToActOn;
}
