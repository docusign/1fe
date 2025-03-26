import { Command, Option } from '@commander-js/extra-typings';
import { devCommandAction } from './devAction';

export const devCommand = new Command('dev')
  .description('dev command for 1fe-cli')
  .addOption(
    new Option(
      '--transpileOnly',
      'Skip type checking in ts-loader. This is only supported in the dev command to help legacy codebases transition to 1DS.',
    ).default(false),
  )
  .addOption(
    new Option(
      '--overrideRuntimeConfig',
      "Override your widget's integration runtime with your local .1ds.config.ts changes using the runtime_config_overrides query param.",
    ).default(false),
  )
  .addOption(
    new Option(
      '--headless',
      'Do not open the browser when running the dev command. This is most useful when running multiple widgets locally.',
    ).default(false),
  )
  .addOption(new Option('--no-contracts-install', 'Disable updating contracts'))
  .action(devCommandAction);
