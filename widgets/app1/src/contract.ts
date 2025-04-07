/* eslint-disable @typescript-eslint/no-empty-interface */

import { PlatformPropsType } from '@devhub/1fe-shell';

export type HostPropsContract = {};

export type WidgetProps = {
  host: HostPropsContract;
  platform: PlatformPropsType;
};
