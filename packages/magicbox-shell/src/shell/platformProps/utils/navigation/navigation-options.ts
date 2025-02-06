import { type NavigateOptions } from 'react-router-dom';

export type SupportedOneDsNavOptions = {
  /**
   * The default options for react-router-dom's `useNavigate`
   */
  reactRouterOptions?: NavigateOptions;

  /**
   * Setting this to true safely navigates
   * The default value is false.
   */
  pluginToPluginNavigation?: boolean;

  /**
   * Setting this to true is the same as directly importing `useNavigate` from `react-router-dom` into your widget.
   * The default value is false.
   */
  doNotUpdateUrl?: boolean;
};

export const DefaultOneDsNavOptions: SupportedOneDsNavOptions = {
  reactRouterOptions: {} as NavigateOptions,
  pluginToPluginNavigation: false,
  doNotUpdateUrl: false,
};

/**
 * Type guard identifying use of SupportedOneDsNavOptions
 * @param options Options type
 * @returns True if options is SupportedOneDsNavOptions
 */
export function isSupportedOneDsNavOption(
  options?: NavigateOptions | SupportedOneDsNavOptions,
): options is SupportedOneDsNavOptions | undefined {
  // options are optional, undefined is acceptable
  if (!options) return true;

  return Object.keys(options).some((k) => k in DefaultOneDsNavOptions);
}
