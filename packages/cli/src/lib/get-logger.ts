import { onefeProgram } from '../oneFeProgram/oneFeProgram';
import chalk from 'chalk';

/**
 * TODO - consolidate use of loggers here.
 NOTE: Do not use it outside of the context of commander program.
 example: we must not import it and call it at the top level execution context of any file.
 However, calling this inside an action for a command is ok because commander would have parsed the cli params by then
 */
export function getLogger(prefix: `[${string}]`) {
  const trace = onefeProgram.opts().trace;

  const coloredPrefix = chalk.dim(prefix);

  return {
    /** General purpose log. Shows up always */
    log: (...args: any[]) => console.log(`${prefix}`, ...args),

    /** Debug log. Shows up only when trace is enabled */
    debug: (...args: any[]) =>
      trace ? console.debug(`${prefix}`, ...args) : undefined,

    /** Info log. Shows up only when trace is enabled */
    info: (...args: any[]) =>
      trace ? console.log(`${prefix}`, ...args) : undefined,

    /** Warning log. Shows up only when trace is enabled */
    warn: (...args: any[]) =>
      trace ? console.warn(`${prefix}`, ...args) : undefined,

    /** Error log. Shows up always */
    error: (...args: any[]) => console.error(`${prefix}`, ...args),
  };
}
