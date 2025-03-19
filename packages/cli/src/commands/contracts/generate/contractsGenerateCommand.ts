import { Command } from '@commander-js/extra-typings';
import { contractsGenerateAction } from './contractsGenerateAction';

export const contractsGeneateCommand = new Command('generate')
  .description('Generates contracts for your widget')
  .action(contractsGenerateAction);
