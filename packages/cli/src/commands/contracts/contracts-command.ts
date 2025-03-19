import { Command } from '@commander-js/extra-typings';
import { contractsInstallCommand } from './commands/contractsInstallCommand';

export const contractsCommand = new Command('contracts')
  .description('Manage widget contracts')
  .addCommand(contractsInstallCommand);
