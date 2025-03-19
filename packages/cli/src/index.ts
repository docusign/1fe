#!/usr/bin/env node

import { onefeProgram } from './oneFeProgram/oneFeProgram';
import { buildCommand } from './commands/build/build-command';
import { contractsCommand } from './commands/contracts/contracts-command';
import { getLogger } from './lib/getLogger';
import { checkNodeVersion } from './lib/nodeCheck';

const main = async () => {
  const logger = getLogger('[1fe]');

  try {
    await checkNodeVersion();

    onefeProgram.addCommand(buildCommand);
    onefeProgram.addCommand(contractsCommand);

    await onefeProgram.parseAsync(process.argv);
  } catch (error) {
    logger.error('An error occurred:', error);
    process.exit(1);
  }
};

export type { OneFeConfiguration as OneFeConfiguration } from './lib/config/config.types';

// TODO - CLI sub commands have options. How do we pass them to the main function if we expose this CLI function?
// export const CLI = (options: CliConfigOptions) => {
//   return main(options);
// };

// Kick off CLI execution, only when this file is executed
if (require.main === module) {
  main();
}
