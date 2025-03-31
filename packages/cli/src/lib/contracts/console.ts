import chalk from 'chalk';
import { EOL } from 'node:os';

/**
 * Helper function that prints out the contract errors to the console
 * @param invalidContracts List of invalid contracts
 * @param stdout Output of the tsc command
 */
export const displayContractErrors = (
  invalidContracts: string[],
  stdout: string,
): void => {
  const spacer = `${EOL}${EOL}`;

  const introMessage = chalk.bold.redBright(
    `Contract Validation Failed!${spacer}`,
  );

  const invalidTemplate =
    invalidContracts.length > 0
      ? `${chalk.bold.redBright(
          'Missing Contracts:',
        )}${spacer}${invalidContracts.join(EOL)}${spacer}`
      : ``;
  const tscTemplate = stdout
    ? `${chalk.bold.redBright('TypeScript Errors:')}${spacer}${stdout}${spacer}`
    : ``;

  const instructions = chalk.bold.redBright(
    `Please fix the above issues and try again.`,
  );

  const template = `${introMessage}${invalidTemplate}${tscTemplate}${instructions}`;

  // this is a custom log that does not need a tag, so not using nodeConsoleLogger
  // eslint-disable-next-line no-console
  console.log(template);
};
