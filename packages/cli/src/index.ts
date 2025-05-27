#!/usr/bin/env node

import { buildCommand } from './commands/build/buildCommand';
import { contractsCommand } from './commands/contracts/contracts-command';
import { devCommand } from './commands/dev/devCommand';
import { generateCommand } from './commands/generate/generateCommand';
import { getLogger } from './lib/getLogger';
import { checkNodeVersion } from './lib/nodeCheck';
import { oneFeProgram } from './oneFeProgram/oneFeProgram';

const main = async () => {
  const logger = getLogger('[1fe]');

  try {
    await checkNodeVersion();

    oneFeProgram.addCommand(buildCommand);
    oneFeProgram.addCommand(devCommand);
    oneFeProgram.addCommand(contractsCommand);
    oneFeProgram.addCommand(generateCommand);

    await oneFeProgram.parseAsync(process.argv);
  } catch (error) {
    logger.error('An error occurred running the 1fe cli.', error);
    process.exit(1);
  }
};

export type {
  OneFeBaseConfigurationObject,
  OneFeEnvironmentObject,
  OneFeRuntimeConfigObject,
  TypedOneFeBaseConfig,
  TypedOneFeConfiguration,
  TypedOneFeBaseConfigurationObject,
  OneFeBaseConfiguration,
  OneFeConfiguration,
} from './lib/config/config.types';

export type { OneFeDynamicConfig } from './lib/config/dynamicConfig.types';

// Kick off CLI execution, only when this file is executed
if (require.main === module) {
  main();
}
