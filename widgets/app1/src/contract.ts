import { PlatformPropsType } from '@1fe/shell';

export type HostPropsContract = Record<string, unknown>;

export type WidgetProps = {
  host: HostPropsContract;
  platform: PlatformPropsType;
};
