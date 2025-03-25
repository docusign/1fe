import { OneFEProcessedConfigs } from '../types/one-fe-server';

let oneFEConfigs: OneFEProcessedConfigs | null = null;

export const readOneFEConfigs = (): OneFEProcessedConfigs | null => {
  return oneFEConfigs;
};

export const setOneFEConfigs = (newConfigs: OneFEProcessedConfigs) => {
  oneFEConfigs = newConfigs;
};
