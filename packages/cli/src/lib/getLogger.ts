import { oneFeProgram } from '../oneFeProgram/oneFeProgram';
import chalk from 'chalk';

/**
 * TODO - consolidate use of loggers here.
 NOTE: Do not use it outside of the context of commander program.
 example: we must not import it and call it at the top level execution context of any file.
 However, calling this inside an action for a command is ok because commander would have parsed the cli params by then
 */
export function getLogger(prefix: `[${string}]`) {
  const trace = oneFeProgram.opts().trace;

  const coloredPrefix = chalk.gray(prefix);

  return {
    /** General purpose log. Shows up always */
    log: (...args: any[]) => console.log(`${coloredPrefix}`, ...args),

    /** Debug log. Shows up only when trace is enabled */
    debug: (...args: any[]) =>
      trace ? console.debug(`${coloredPrefix}`, ...args) : undefined,

    /** Info log. Shows up only when trace is enabled */
    info: (...args: any[]) =>
      trace ? console.log(`${coloredPrefix}`, ...args) : undefined,

    /** Warning log. Shows up only when trace is enabled */
    warn: (...args: any[]) =>
      trace ? console.warn(`${coloredPrefix}`, ...args) : undefined,

    /** Error log. Shows up always */
    error: (...args: any[]) =>
      console.error(
        `${coloredPrefix}`,
        ...args.map((arg) => (typeof arg === 'string' ? chalk.red(arg) : arg)),
      ),
  };
}
