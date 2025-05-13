// import { getWidgetBaseCdnUrl } from '@1ds/helpers/isomorphic';
// import type { HostedEnvironment } from '@1ds/helpers/types';
// import { getWidgetCdnVariants } from './variants';
// import { WidgetId } from './types';
import { getKnownUris } from '../network/getKnownUris';

type WidgetContractCDNUrls = {
  defaultUrl: string;
  defaultUrlInVariantFolder: string;
} & Record<string, string>;

export const widgetContractPath = '/types/contract.rolledUp.d.ts';
const widgetContractPathWithVariants =
  '/types/contracts/contract.rolledUp.d.ts';
const getVariantContractPath = (variantId: string) =>
  `/types/contracts/${variantId}Contract.rolledUp.d.ts`;
/**
 * Get the URL for your widget's contract types on the CDN
 * @param environment The environment your widget is deployed to
 * @param widgetId Your widget's ID
 * @param version The version of the widget
 * @returns The URL for your widget's bundle on the CDN, as well as the URL for each variant
 *
 */
export const getWidgetContractCdnUrl = async (baseUrlArgs: {
  environment: string;
  widgetId: string;
  version: string;
}): Promise<WidgetContractCDNUrls> => {
  const baseUrl = (
    await getKnownUris(baseUrlArgs.environment)
  ).getWidgetBaseCdnUrl(baseUrlArgs.widgetId, baseUrlArgs.version);

  // const variantIds: string[] = await getWidgetCdnVariants(
  //   baseUrl,
  //   baseUrlArgs.widgetId as WidgetId,
  // );

  const variantIds: string[] = []; // TODO - add when variants support is needed.

  const variantContractUrls = variantIds.reduce(
    (acc: Record<string, string>, id) => {
      acc[id] = `${baseUrl}${getVariantContractPath(id)}`;
      return acc;
    },
    {},
  );

  return {
    defaultUrl: `${baseUrl}${widgetContractPath}`,
    defaultUrlInVariantFolder: `${baseUrl}${widgetContractPathWithVariants}`,
    ...variantContractUrls,
  };
};
