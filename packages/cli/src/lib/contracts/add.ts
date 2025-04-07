import { outputFileSync } from 'fs-extra';
import { buildContractFile } from './contract';
import { FileSystem } from './files';
import { updateKnownWidgetsFile } from './registry';
import type {
  ContractVersion,
  InstallContractResult,
  WidgetContractNotFoundResult,
  WidgetContractUpToDate,
  WidgetContractUpdated,
  WidgetId,
  WidgetNotFoundResult,
} from './types';
import { getWidgetContractCdnUrl } from './url';
import { fetchWithTimeout } from '../network/network';
import { getKnownPaths } from '../paths/getKnownPaths';

export type AddContractResult = (
  | WidgetContractNotFoundResult
  | WidgetNotFoundResult
  | WidgetContractUpToDate
  | WidgetContractUpdated
) & { widgetId: WidgetId };

/**
 * Adds a contract type declaration file from the given versions to the
 * project types directory.
 * @param widgetId - The widgetId whose contract will be added
 * @param environment - The environment to use to fetch the contract
 * @param version - Optional explicit version to use
 * @returns An AddContractResult
 */
export async function addOrUpgradeContract(
  widgetId: WidgetId,
  environment: string,
  version?: ContractVersion,
): Promise<InstallContractResult[]> {
  const projectSrcTypesPath = getKnownPaths().contracts.typesDir;

  if (!version) {
    return [
      {
        type: 'WidgetNotFoundResult',
        widgetId,
      },
    ];
  }

  const fileSystem = new FileSystem(projectSrcTypesPath);

  const existingContract = await fileSystem.readWidgetContract(widgetId);
  const existingVersion = existingContract?.header.version;
  const isOutOfDate = existingVersion !== version;

  if (!isOutOfDate) {
    return [
      {
        type: 'WidgetContractUpToDate',
        widgetId,
        version,
      },
    ];
  }

  const urls = await getWidgetContractCdnUrl({
    environment,
    widgetId,
    version,
  });

  const { defaultUrl, defaultUrlInVariantFolder, ...variantUrls } = urls;
  const variantIds = Object.keys(variantUrls);

  /**
   * Creates and writes a contract file from successful fetch responses
   * @returns A WidgetContractUpdated result if the contract was written to disk, else a WidgetContractNotFoundResult
   */
  const handleCdnResponseAndCreateFile = async (
    response: Response,
    widgetIdWithVariant: WidgetId,
  ): Promise<InstallContractResult> => {
    if (response.status !== 200) {
      return {
        type: 'WidgetContractNotFoundResult',
        widgetId: widgetIdWithVariant,
        expectedUrl: response.url,
      };
    }

    const contract = await response.text();
    const writePath = fileSystem.resolveWidgetContractPath(widgetIdWithVariant);
    const contractFileContent = buildContractFile(
      decodeURIComponent(response.url),
      contract,
    );

    outputFileSync(writePath, contractFileContent, {
      encoding: 'utf-8',
      flag: 'w',
    });

    return {
      type: 'WidgetContractUpdated',
      widgetId: widgetIdWithVariant,
      version,
    };
  };

  /**
   * Fetches the main contract file, which may be located in one of two places
   * The defaultInVariantFolder has been phased out but is still supported for backwards compatibility
   * @param urlOrUrls - If given a single URL will attempt to fetch that URL, if given an array of URLs will attempt to fetch each URL in order and only return the first successful response
   */
  const installContract = async (
    urlOrUrls: string | string[],
    widgetIdWithVariant: WidgetId,
  ): Promise<InstallContractResult> => {
    const urls = urlOrUrls instanceof Array ? urlOrUrls : [urlOrUrls];
    const responses = urls.map((url) => fetchWithTimeout(decodeURI(url)));
    for await (const response of responses) {
      if (response.status === 200) {
        return handleCdnResponseAndCreateFile(response, widgetIdWithVariant);
      }
    }

    return {
      type: 'WidgetContractNotFoundResult',
      widgetId: widgetIdWithVariant,
      expectedUrl: urls[0],
    };
  };

  const installContractResults: InstallContractResult[] = await Promise.all([
    // Fetch the main contract file at whichever location it may be
    installContract([defaultUrl, defaultUrlInVariantFolder], widgetId),

    ...variantIds.map(async (variantId) =>
      installContract(urls[variantId], `${widgetId}/${variantId}`),
    ),
  ]);

  await updateKnownWidgetsFile(fileSystem);

  return installContractResults;
}
