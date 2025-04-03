import { OptionsOf } from '../../../lib/types/commanderUtils';
import { contractsInstallCommand } from './contractsInstallCommand';

export type ContractsInstallOptions = OptionsOf<typeof contractsInstallCommand>;
