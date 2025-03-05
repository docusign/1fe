/* eslint-disable @typescript-eslint/no-empty-interface */

type PlatformProps = {
  /*
   * NOTE: This is a placeholder for the utils type
   * A more formal definition will be available in the future.
   */
  utils: Record<string, unknown>;
  context: {
    self: {
      widgetId: string;
      version: string;
    };
  };
  environment: string;
};

// Widget starter kit is a plugin and does not expect any host props.
// The empty interface still results in a zod schema that is used to validate that no host props were sent
// export const hostPropsContractSchema = z.object({});
export interface HostPropsContract {}

export type WidgetProps = {
  platform: PlatformProps;
  host?: HostPropsContract;
};
