import { oneFeProgram } from '../oneFeProgram/oneFeProgram';
import chalk from 'chalk';

/**
 * TODO - consolidate use of loggers here.
 NOTE: Do not use it outside of the context of commander program.
 example: we must not import it and call it at the top level execution context of any file.
 However, calling this inside an action for a command is ok because commander would have parsed the cli params by then
 */
export function getLogger(prefix: `[${string}]`) {
  const debug = oneFeProgram.getOptionValue('debug');
  const trace = oneFeProgram.getOptionValue('trace');

  const coloredPrefix = chalk.gray(prefix);

  const logger = {
    /** General purpose log. Shows up always */
    log: (...args: any[]) => console.log(`${coloredPrefix}`, ...args),

    /** Debug log. Shows up only when --debug is used */
    debug: (...args: any[]) => console.debug(`${coloredPrefix}`, ...args),

    /** Info log. Shows up only when --trace is used */
    info: (...args: any[]) => console.log(`${coloredPrefix}`, ...args),

    /** Warning log. Shows up only when --trace is used */
    warn: (...args: any[]) => console.warn(`${coloredPrefix}`, ...args),

    /** Error log. Shows up always */
    error: (...args: any[]) =>
      console.error(
        `${coloredPrefix}`,
        ...args.map((arg) => (typeof arg === 'string' ? chalk.red(arg) : arg)),
      ),
  };

  if (!trace) {
    logger.info = () => {};
    logger.warn = () => {};
  }

  if (!debug) {
    logger.debug = () => {};
  }

  return logger;
}
