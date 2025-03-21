import { Command, Option } from '@commander-js/extra-typings';
import packageJson from '../../package.json';
import { preActionHook } from './preAction';
import { parseEnv } from '../lib/config/parseEnv';

export const oneFeProgram = new Command()
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .hook('preAction', preActionHook)
  .hook('postAction', async () => {
    console.log('post action hook executed');
  })
  .addOption(
    new Option(
      '--environment <environment>',
      'Environment to build for. This should match one of the environments defined in your .1fe.config.ts',
    )
      .argParser(parseEnv)
      .makeOptionMandatory(),
  )
  .addOption(
    new Option(
      '--trace',
      'log extra information to the terminal for beter insight into what the CLI is doing.',
    )
      .conflicts('debug')
      .default(false as boolean),
  )
  .addOption(
    new Option(
      '--debug',
      'Enables --trace by default and logs options and parameters in various processes to the terminal for debugging',
    )
      .conflicts('trace')
      .default(false as boolean),
  )
  .option(
    '--ci',
    'Run in CI mode. Follows process.env.CI.',
    !!process.env.CI || false,
  )
  .option(
    '-q, --quiet',
    'Disable the 1FE Help Bot animation at the start of a command',
    false as boolean,
  );
