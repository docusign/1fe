import { get } from './get';
import { getByUrl } from './getByUrl';
import { getAsset } from './getAsset';

type WidgetArgs = {
  system: typeof System;
  hostWidgetId: string;
};

export const widgets = ({ system, hostWidgetId }: WidgetArgs) => ({
  get: get(system, hostWidgetId),
  getByUrl: getByUrl(system, hostWidgetId),
  getAsset: getAsset(system, hostWidgetId),
});
