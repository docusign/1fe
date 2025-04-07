import { getLogger } from '../getLogger';
import { InstallContractResult } from './types';

function throwIfActionResultNotHandled(x: never): never {
  throw new Error(`Unknown value ${x}`);
}

export async function handleInstallActionResults(
  reportsOfActionTaken: InstallContractResult[],
  environment: string,
  outdated: boolean,
): Promise<string[]> {
  const logger = getLogger('[cli][contracts]');
  const conflicts: string[] = [];
  const upToDate: string[] = [];
  for await (const result of reportsOfActionTaken) {
    switch (result.type) {
      case 'WidgetContractNotFoundResult': {
        // There are still several widgets who are not publishing contracts, we do not want to punish widgets for using their dependsOn array when it is the dependent widget who is at fault
        const message = `Published contract not available for latest published version of ${result.widgetId}: (${result.expectedUrl})`;
        logger.warn(message);
        break;
      }
      case 'WidgetNotFoundResult': {
        const message = `Widget ${result.widgetId} not found in published versions (${environment})`;
        if (outdated) {
          conflicts.push(message);
        } else {
          logger.warn(message);
        }
        break;
      }
      case 'WidgetContractUpToDate': {
        upToDate.push(`${result.widgetId} - ${result.version}`);
        logger.info(
          `Widget ${result.widgetId} is up-to-date ${result.version}`,
        );
        break;
      }
      case 'WidgetContractUpdated': {
        upToDate.push(`${result.widgetId} - ${result.version}`);
        logger.info(`Widget ${result.widgetId} upgraded to ${result.version}`);
        break;
      }
      case 'WidgetContractRemoved': {
        logger.info(`Widget ${result.widgetId} removed`);
        break;
      }
      default:
        throwIfActionResultNotHandled(result);
    }
  }

  if (upToDate.length > 0) {
    logger.info(`Up-to-date widgets: ${upToDate.join(', ')}`);
  }

  return conflicts;
}
