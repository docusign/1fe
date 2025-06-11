import chalk, { type ChalkInstance } from 'chalk';

/**
 * NOTE: Do not use it outside of the context of commander program.
 * example: we must not import it and call it at the top level execution context of any file.
 * However, calling this inside an action for a command is ok because commander would have parsed the cli params by then
 */
export function getLogger(prefix: `[${string}]`, debug = false, trace = false) {
  const coloredPrefix = chalk.gray(prefix);

  const logger = {
    /** General purpose log. Shows up always */
    log: (...args: any[]) => console.log(`${coloredPrefix}`, ...args),

    /** Debug log. Shows up only when --debug is used */
    debug: (...args: any[]) =>
      console.debug(`${coloredPrefix}`, ...colorStrings('cyan')(...args)),

    /** Info log. Shows up only when --trace is used */
    info: (...args: any[]) =>
      console.log(`${coloredPrefix}`, ...colorStrings('gray')(...args)),

    /** Warning log. Shows up only when --trace is used */
    warn: (...args: any[]) =>
      console.warn(`${coloredPrefix}`, ...colorStrings('yellow')(...args)),

    /** Error log. Shows up always */
    error: (...args: any[]) =>
      console.error(`${coloredPrefix}`, ...colorStrings('red')(...args)),
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

type ChalkColors = keyof Omit<
  ChalkInstance,
  'hex' | 'level' | 'rgb' | 'ansi256' | 'bgRgb' | 'bgHex' | 'bgAnsi256'
>;

function colorStrings(color: ChalkColors) {
  return (...args: any[]) =>
    args.map((arg) => (typeof arg === 'string' ? chalk[color](arg) : arg));
}
