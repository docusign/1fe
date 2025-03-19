import { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import { getLogger } from '../lib/get-logger';
import { onefeProgram } from '../oneFeProgram/oneFeProgram';

export const preActionHook = async (
  thisCommand: Command<[], {}, {}>,
  actionCommand: CommandUnknownOpts,
) => {
  const logger = getLogger('[cli-pre-action]');

  logger.log('Starting the CLI with options:', onefeProgram.opts());
};
