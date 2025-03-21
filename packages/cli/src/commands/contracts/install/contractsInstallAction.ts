import { getConfig } from '../../../lib/config/getConfig';
import { getLogger } from '../../../lib/getLogger';

export async function contractsInstallAction() {
  // - get live versions
  // - get currently installed contracts (looking at dependsOn versions as well)
  // - make a list of widgets with out of date and missing contracts
  // - get all the contracts needed

  const logger = getLogger('[contracts][install]');

  logger.log('Installing contracts...');
}
