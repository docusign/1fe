import { Command } from '@commander-js/extra-typings';

import { name, version } from '../../package.json';
import { OptionsOf } from '../lib/commanderUtils';
import { rootAction } from './root-action';

const rootCommandDef = new Command(name)
  .version(version)
  .description('CLI tool to scaffold a 1fe app')
  .option('-d, --debug', 'enable debug logs', false as boolean)
  .option('--trace', 'enable trace logs', false as boolean);

export type RootCommandOptions = OptionsOf<typeof rootCommandDef>;

export const rootCommand = rootCommandDef.action(rootAction);
