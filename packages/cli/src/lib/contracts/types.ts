export type WidgetId = `@${string}`;
export type VersionedWidgetId = `${WidgetId}@${string}`;
export type ContractVersion = string;

export type ContractUpgradeInfo = {
  widgetId: WidgetId;
  availableVersion?: ContractVersion | null;
  installedVersion?: ContractVersion;
};

export type ContractFileHeader = {
  url: string;
  environment: string;
  version: ContractVersion;
  widgetId: WidgetId;
  variantId: string;
};

export type ContractFile = {
  path: string;
  header: ContractFileHeader;
};

export type WidgetContractNotFoundResult = {
  type: 'WidgetContractNotFoundResult';
  expectedUrl: string;
};

export type WidgetNotFoundResult = {
  type: 'WidgetNotFoundResult';
};

export type WidgetContractUpToDate = {
  type: 'WidgetContractUpToDate';
  version: ContractVersion;
};

export type WidgetContractRemoved = {
  type: 'WidgetContractRemoved';
};

export type WidgetContractUpdated = {
  type: 'WidgetContractUpdated';
  version: ContractVersion;
};

export type InstallContractResult = (
  | WidgetContractNotFoundResult
  | WidgetNotFoundResult
  | WidgetContractUpToDate
  | WidgetContractRemoved
  | WidgetContractUpdated
) & { widgetId: WidgetId };
