import { PlatformPropsType } from '@1fe/shell';

export type HostPropsContract = Record<string, unknown>;

export type WidgetEvents = {
  event1: { param1: string };
};

export type WidgetProps = {
  host: HostPropsContract;
  platform: PlatformPropsType;
};
