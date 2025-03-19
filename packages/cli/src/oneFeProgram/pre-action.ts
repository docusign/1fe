import { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import { onefeProgram } from '../oneFeProgram/oneFeProgram';
import { getLogger } from '../lib/getLogger';
import { existsSync } from 'fs';
import { getKnownPaths } from '../lib/paths/getKnownPaths';

export const preActionHook = async (
  thisCommand: Command<[], {}, {}>,
  actionCommand: CommandUnknownOpts,
) => {
  const logger = getLogger('[1fe][pre-action]');

  if (!existsSync(getKnownPaths().oneFeConfig)) {
    logger.error(
      'No OneFe config file found. Please ensure that you are running the CLI from the root of a OneFe project.',
    );
    process.exit(1);
  }

  logger.log('Starting the CLI with options:', onefeProgram.opts());
};
