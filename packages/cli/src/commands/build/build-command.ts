import { Command, Option } from '@commander-js/extra-typings';
import { buildAction } from './build-action';

export const buildCommand = new Command()
  .name('build')
  .description(`build a 1FE widget`)
  .addOption(
    new Option('--mode <mode>', 'Build mode')
      .default('production')
      .choices(['development', 'production']),
  )
  .option(
    '-l, --live-version-env',
    'Which environment to fetch live versions from. The information fetched is used to determine what libraries are externalized from your library and what versions to install locally in your package.json. This should match one of the environments defined in your .1fe.config.ts',
  )
  .option('-a, --analyze-bundle-locally', 'Analyze the bundle locally')
  .action(buildAction);
