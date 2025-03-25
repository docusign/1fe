#!/usr/bin/env node

import { oneFeProgram } from './oneFeProgram/oneFeProgram';
import { buildCommand } from './commands/build/buildCommand';
import { contractsCommand } from './commands/contracts/contracts-command';
import { getLogger } from './lib/getLogger';
import { checkNodeVersion } from './lib/nodeCheck';
import { devCommand } from './commands/dev/devCommand';

const main = async () => {
  const logger = getLogger('[1fe]');

  try {
    await checkNodeVersion();

    oneFeProgram.addCommand(buildCommand);
    oneFeProgram.addCommand(devCommand);
    oneFeProgram.addCommand(contractsCommand);

    await oneFeProgram.parseAsync(process.argv);
  } catch (error) {
    logger.error('An error occurred running the 1fe cli.', error);
    process.exit(1);
  }
};

export type {
  OneFeConfiguration,
  OneFeBaseConfiguration,
} from './lib/config/config.types';

export type { OneFeCommonConfig } from './lib/config/commonConfig.types';

// Kick off CLI execution, only when this file is executed
if (require.main === module) {
  main();
}
