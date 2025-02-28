import { Command } from '@commander-js/extra-typings';

export const buildCommand = new Command()
  .name('build')
  .description(`build a 1FE widget`)
  .option('--mode <mode>', 'Set the build mode', 'production')
  .option(
    '-l, --live-version-env',
    'Which environment to fetch live versions from. The information fetched is used to determine what libraries are externalized from your library and what versions to install locally in your package.json',
  )
  .option('-a, --analyze-bundle-locally', 'Analyze the bundle locally')
  .option(
    '--no-rollup-contract',
    'Disable building contract.rolledUp.d.ts.',
    false as boolean,
  )
  .option(
    '--no-contracts-install',
    'Runs the build command without first updating contracts for your dependent widgets',
    false as boolean,
  )
  .option('--dev', 'Start a development server', false as boolean)
  .option(
    '--transpile-only',
    'Transpile only, do not bundle. Can only be used with --dev',
    false as boolean,
  );
