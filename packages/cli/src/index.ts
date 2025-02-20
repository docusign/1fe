#!/usr/bin/env node

import { Command, Option } from 'commander';
import commands from './commands';

import { preActionHook } from './commands/pre-action';
import { addCommandsToProgram } from './utils/commands';
import { checkNodeVersion } from './utils/node-check';
import packageJson from '../package.json';
import { CliConfigOptions } from './types';

/**
 * BROWSERSLIST_IGNORE_OLD_DATA suppresses the warning below. We do not want widget teams modifying browserslist.
 *
 * Browserslist: caniuse-lite is outdated. Please run:
 *    npx update-browserslist-db@latest
 *    Why you should do it regularly: https://github.com/browserslist/update-db#readme
 */
process.env.BROWSERSLIST_IGNORE_OLD_DATA = 'true';

const main = async (options?: CliConfigOptions) => {

  // const {commonConfigs, environment, isCi, mode, webpackConfigs, debug} = options;

  console.log(`CLI started with ${JSON.stringify(options)} options`)

  // Check node at the top to avoid fetch() in fetchLiveVersions throwing problems for people with older node versions
  await checkNodeVersion();

  const widgetId = packageJson.name.replace(/\//g, '-').replace(/@/g, '');

  const program = new Command()
    .name(widgetId)
    .description(packageJson.description)
    .version(packageJson.version)
    .hook('preAction', preActionHook)
    .hook('postAction', async () => {
        console.log('post action hook executed');
    })
    .addOption(
      new Option(
        '--trace',
        'log arguments and options to the terminal for debugging',
      ).default(false),
    )
    .addOption(
      new Option(
        '--quiet, -q',
        'Disable the 1FE Help Bot animation at the start of a command',
      ).default(false),
    )
    .addOption(
      new Option(
        '--next',
        'Signal that you are preparing your widget for a major version upgrade. This will allow your widget major version to be newer than the currently released 1FE ecosystem major version. Read about the 1FE ecosystem versioning philosophy.',
      ).default(false),
    );

  addCommandsToProgram({ program, commands });

  program.parseAsync(process.argv);
};

export type {
  CliConfigOptions,
  PinnedWidget,
  Preload,
} from './types';



export const CLI = (options: CliConfigOptions) => {
  return main(options)
}

// Kick off CLI execution, only when this file is executed
if (require.main === module) {
  main();
}
