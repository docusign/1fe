import { PlatformPropsType } from '@devhub/1fe-shell';

export type HostPropsContract = {};

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface WidgetProps {
  host: HostPropsContract;
  platform: PlatformPropsType;
}
