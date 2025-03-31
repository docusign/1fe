import { PlatformPropsType } from '@devhub/1fe-shell';

export type HostPropsContract = {};

export type WidgetEvents = {
  event1: { param1: string };
};

export type WidgetProps = {
  host: HostPropsContract;
  platform: PlatformPropsType;
};
