import { getLogger } from './get-logger';

/**
 * ! Exit the process with a message
 * @param code exit code
 * @param args anything to pass to the logger.error method
 */
export function exitWith(code: number, callAhead?: () => void) {
  callAhead?.();
  process.exit(code);
}
