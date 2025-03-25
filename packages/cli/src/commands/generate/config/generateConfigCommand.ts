import { Command, Option } from '@commander-js/extra-typings';
import { generateConfigAction } from './generateConfigAction';

export const generateConfigCommand = new Command('config')
  .addOption(
    new Option(
      '-o, --out-dir <path>',
      'output directory',
    ).makeOptionMandatory(),
  )
  .description(
    'generates a 1fe runtime configuration file in the specified directory.',
  )
  .action(generateConfigAction);
