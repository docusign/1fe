import { PlatformPropsType } from '@1fe/shell';

export interface HostPropsContract {}

export type WidgetProps = {
  platform: PlatformPropsType;
  host?: HostPropsContract;
};
