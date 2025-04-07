import type { LiveVersions } from '../types/version';
import type { ContractVersion, WidgetId } from './types';

export function findLiveContractVersion(
  liveVersions: LiveVersions,
  widgetId: WidgetId,
): ContractVersion | undefined {
  const version = liveVersions.configs.widgetConfig.find(
    (wc) => wc.widgetId === widgetId,
  )?.version;

  return version as ContractVersion;
}
