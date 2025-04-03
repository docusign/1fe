import chalk from 'chalk';
import {
  ExecOptions,
  exec as __exec,
  spawn as __spawn,
  // execSync,
} from 'node:child_process';
import { promisify } from 'node:util';
import { getLogger } from './getLogger';

const _nodeExec = promisify(__exec);

export const exit = (code: number) => {
  const logger = getLogger('[cli]');
  logger.error(`Exiting with code ${code}`);
  return process.exit(code);
};

/**
 * Execute a shell command and return the stdout from the result
 * If the command fails, the error is thrown
 * @param command Command to execute
 * @param options Options to pass to the exec function
 * @returns stdout from the command
 */
export const exec = async (command: string, options?: ExecOptions) => {
  const logger = getLogger('[cli]');
  logger.info(`executing command: ${chalk.cyan(command)}`);

  const { stdout } = await _nodeExec(command, options);

  logger.info(`Command stdout: ${chalk.cyan(stdout)}`);

  return stdout;
};
