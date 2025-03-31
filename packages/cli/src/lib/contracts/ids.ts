import type { ContractVersion, VersionedWidgetId, WidgetId } from './types';

export function isVersionedWidgetId(
  widgetId: WidgetId | VersionedWidgetId,
): widgetId is VersionedWidgetId {
  const portions = widgetId.split('@');
  return portions.length > 2;
}

export type ParsedVersionedWidgetId = {
  widgetId: WidgetId;
  version: ContractVersion;
};

export function parseVersionedWidgetId(
  versionedWidgetId: VersionedWidgetId,
): ParsedVersionedWidgetId {
  const parts = versionedWidgetId.split(/@/);
  const widgetId: WidgetId = `@${parts[1]}`;
  const version: ContractVersion = parts[2];

  return { widgetId, version };
}
