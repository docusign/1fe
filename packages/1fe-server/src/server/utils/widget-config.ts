import { WidgetConfigs } from '../types';

let cachedWidgetConfigs: WidgetConfigs = new Map();

export const getCachedWidgetConfigs = (): WidgetConfigs => {
  return cachedWidgetConfigs;
};

export const setCachedWidgetConfigs = (
  newWidgetconfigs: WidgetConfigs,
): void => {
  cachedWidgetConfigs = newWidgetconfigs;
};
