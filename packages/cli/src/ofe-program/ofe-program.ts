import { Command } from '@commander-js/extra-typings';
import packageJson from '../../package.json';
import { preActionHook } from '../commands/pre-action';

export const ofeProgram = new Command()
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .hook('preAction', preActionHook)
  .hook('postAction', async () => {
    console.log('post action hook executed');
  })
  .option(
    '--trace',
    'log arguments and options to the terminal for debugging',
    false as boolean,
  )
  .option(
    '--quiet, -q',
    'Disable the 1FE Help Bot animation at the start of a command',
    false as boolean,
  )
  .option(
    '--next',
    'Signal that you are preparing your widget for a major version upgrade. This will allow your widget major version to be newer than the currently released 1FE ecosystem major version. Read about the 1FE ecosystem versioning philosophy.',
    false as boolean,
  );
