export type {
  ContractVersion,
  WidgetContractNotFoundResult,
  WidgetContractUpToDate,
  WidgetContractUpdated,
  WidgetId,
  WidgetNotFoundResult,
} from './types';

export { addOrUpgradeContract } from './add';
export { removeContract } from './remove';
export { getCurrentWidgetContracts } from './install';
export { displayContractErrors } from './console';
export { handleInstallActionResults } from './misc';
