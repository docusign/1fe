import { Command } from '@commander-js/extra-typings';
import { contractsInstallAction } from './contractsInstallAction';

export const contractsInstallCommand = new Command('install')
  .description(
    `Install widget contract versions specified in .1ds.config's dependsOn array`,
  )
  .action(contractsInstallAction);
