import renderOneFEShell from './shell';
import { PlatformPropsType } from './shell/types/platform-utils';
import { platformProps } from './shell/utils/system-helpers';

export * from './shell/types/platform-utils';
export * from './shell/types/one-fe-shell-options';
export * from './shell/types/widget-config';

export default renderOneFEShell;
export { platformProps };
export type { PlatformPropsType };
