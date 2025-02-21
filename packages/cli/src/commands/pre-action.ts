import { Command, CommandUnknownOpts } from '@commander-js/extra-typings';

export const preActionHook = async (
  thisCommand: Command<[], {}, {}>,
  actionCommand: CommandUnknownOpts
) => {
  console.log('pre action hook executed');
};
