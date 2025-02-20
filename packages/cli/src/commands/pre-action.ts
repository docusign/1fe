import { Command } from 'commander';

export const preActionHook = async (
  thisCommand: Command,
  actionCommand: Command,
) => {
 console.log('pre action hook executed');
};
