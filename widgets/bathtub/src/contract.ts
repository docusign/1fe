import { PlatformPropsType } from '@devhub/1fe-shell';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface HostPropsContract {}

export type WidgetProps = {
  platform: PlatformPropsType;
  host?: HostPropsContract;
};
