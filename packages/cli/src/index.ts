#!/usr/bin/env node

import { preActionHook } from './commands/pre-action';
import { checkNodeVersion } from './utils/node-check';
import { CliConfigOptions } from './types';
import { buildCommand } from './commands/build/build-command';
import { ofeProgram } from './ofe-program/ofe-program';

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

  console.log(`CLI started with ${JSON.stringify(options)} options`);

  // Check node at the top to avoid fetch() in fetchLiveVersions throwing problems for people with older node versions
  await checkNodeVersion();

  ofeProgram.addCommand(buildCommand);

  await ofeProgram.parseAsync(process.argv);
};

export type { CliConfigOptions, PinnedWidget, Preload } from './types';

export const CLI = (options: CliConfigOptions) => {
  return main(options);
};

// Kick off CLI execution, only when this file is executed
if (require.main === module) {
  main();
}
