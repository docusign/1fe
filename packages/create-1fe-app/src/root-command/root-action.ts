import { getLogger } from '../lib/getLogger';

export async function rootAction() {
  const logger = getLogger('[create-1fe]');
  logger.log('⚒️ Welcome to the 1fe app creator!');
}
