import { Command } from '@commander-js/extra-typings';
import { generateConfigCommand } from './config/generateConfigCommand';

export const generateCommand = new Command('generate')
  .description(
    'A helper command to generate various scaffolding files for your widget.',
  )
  .addCommand(generateConfigCommand);
