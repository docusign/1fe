/* eslint-disable @typescript-eslint/no-empty-interface */

import { PlatformPropsType } from '@devhub/1fe-shell';

export interface HostPropsContract {}

export type WidgetProps = {
  platform: PlatformPropsType;
  host?: HostPropsContract;
};
