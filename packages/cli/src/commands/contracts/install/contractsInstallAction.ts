import { oneFeProgram } from 'src/oneFeProgram/oneFeProgram';
import { getLogger } from '../../../lib/getLogger';

// import {
//   getCurrentWidgetContracts,
//   removeContract,
//   addOrUpgradeContract,
//   displayContractErrors,
//   type WidgetId,
// } from '../../utils/contracts';

// import { formatContractLog, handleInstallActionResults } from './common';
// import { exec, exit } from '../../utils/cli';
// import { fetchLiveVersions } from '../update/utils/package/fetchVersions';
import { fetchLiveVersions } from 'src/lib/network/fetchLiveVersions';
// import { HOSTED_ENVIRONMENTS } from '@1ds/helpers/isomorphic';
// import { getCliOptions } from '../../utils/cliOptions';
// import { nodeConsoleLogger } from '@1ds/helpers/node';
// import { sayGenericOhNo } from '../../utils/face/utils';
import { ContractsInstallOptions } from './contractsInstallCommand.types';
import {
  addOrUpgradeContract,
  displayContractErrors,
  getCurrentWidgetContracts,
  handleInstallActionResults,
  removeContract,
} from 'src/lib/contracts';
import { exec, exit } from 'src/lib/cli';

export async function contractsInstallAction({
  widgetIds = [],
  outdated = false,
}: ContractsInstallOptions) {
  const logger = getLogger('[contracts][install]');
  logger.log('Installing contracts...');

  try {
    // const { L: OptionLiveEnv } = getCliOptions();
    // const shouldSkipCache = isEmpty(OptionLiveEnv);
    // const liveVersionEnv = OptionLiveEnv || HOSTED_ENVIRONMENTS.integration;
    const environment = await oneFeProgram.getOptionValue('environment');

    // // We want to ensure the outdated command is checking against a specific environment
    // if (options.outdated && shouldSkipCache) {
    //   throw new Error('Use -outdated flag with -l flag');
    // }

    const liveVersions = await fetchLiveVersions(environment);

    const currentWidgetContracts =
      await getCurrentWidgetContracts(liveVersions);

    const filteredWidgetContracts = currentWidgetContracts.filter(
      ({ widgetId }) => widgetIds?.length === 0 || widgetIds.includes(widgetId),
    );

    const installActionResults = await Promise.all(
      filteredWidgetContracts.map(({ widgetId, availableVersion }) => {
        if (availableVersion === null) {
          return removeContract(widgetId);
        }
        return addOrUpgradeContract(widgetId, environment, availableVersion);
      }),
    );
    const invalidContracts = await handleInstallActionResults(
      installActionResults.flat(),
      liveVersions!.environment,
      outdated,
    );

    // Only returns stdout if the command fails
    const stdout: string = outdated
      ? await exec('yarn tsc -p tsconfig.json --noEmit').catch((error) => {
          return error.stdout;
        })
      : null;

    if (invalidContracts.length > 0 || stdout) {
      displayContractErrors(invalidContracts, stdout);
      logger.error(`Something went wrong while installing contracts.`);
      exit(1);
    }
  } catch (error) {
    logger.error('Installing Contracts Failed', error);
    exit(1);
  }
}
