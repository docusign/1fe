import { Command, Option } from '@commander-js/extra-typings';

import { name, version } from '../../../package.json';
import { ArgumentsOf, OptionsOf } from '../../lib/commanderUtils';
import { createAction } from './create-action';

export const createCommandDef = new Command(name)
  .argument(
    'appName',
    'name of the app to create. The app will be created in a directory with this name.',
  )
  .version(version)
  .description('CLI tool to scaffold a 1fe app')
  .addOption(new Option('--debug', 'enable debug logs').default(false))
  .addOption(new Option('--trace', 'enable trace logs').default(false))
  .addOption(
    new Option('-p, --git-protocol <protocol>', 'set the git protocol to use')
      .choices(['https', 'ssh'])
      .default('https')
      .makeOptionMandatory(true),
  );

export type CreateCommandOptions = OptionsOf<typeof createCommandDef>;
export type CreateCommandArgs = ArgumentsOf<typeof createCommandDef>;

export const createCommand = createCommandDef.action(createAction);
