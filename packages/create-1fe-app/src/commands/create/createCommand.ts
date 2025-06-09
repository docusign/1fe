import { Command, Option } from '@commander-js/extra-typings';

import { name, version } from '../../package.json';
import { ArgumentsOf, OptionsOf } from '../lib/commanderUtils';
import { rootAction } from './root-action';

export const rootCommandDef = new Command(name)
  .argument(
    'appName',
    'name of the app to create. The app will be created in a directory with this name.',
  )
  .version(version)
  .description('CLI tool to scaffold a 1fe app')
  .option('-d, --debug', 'enable debug logs', false as boolean)
  .option('--trace', 'enable trace logs', false as boolean)
  .addOption(
    new Option('-p, --git-protocol <protocol>', 'set the git protocol to use')
      .choices(['https', 'ssh'])
      .default('https')
      .makeOptionMandatory(true),
  );

export type RootCommandOptions = OptionsOf<typeof rootCommandDef>;
export type RootCommandArgs = ArgumentsOf<typeof rootCommandDef>;

export const rootCommand = rootCommandDef.action(rootAction);
