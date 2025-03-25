import { Command, CommandUnknownOpts } from '@commander-js/extra-typings';
import { oneFeProgram } from './oneFeProgram';
import { getLogger } from '../lib/getLogger';
import { existsSync } from 'fs';
import { getKnownPaths } from '../lib/paths/getKnownPaths';

export const preActionHook = async (
  thisCommand: Command<[], {}, {}>,
  actionCommand: CommandUnknownOpts,
) => {
  const logger = getLogger('[pre-action]');

  if (!existsSync(getKnownPaths().oneFeConfig)) {
    logger.error(
      'No 1fe config file found. Please ensure that you are running the CLI from the root of a 1fe project.',
    );
    process.exit(1);
  }

  const options = await getPlainOptions();

  logger.log('Starting the CLI with options:', options);
};

async function getPlainOptions() {
  const options: Record<string, any> = {};

  for (const key in oneFeProgram.opts()) {
    options[key] = await oneFeProgram.getOptionValue(key);
  }
  return options;
}
