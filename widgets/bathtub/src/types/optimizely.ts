export interface InstanceArgs {
  optimizelySdkKey: string;
  userBucketId: string;
  /**
   * The variable name that stores the value of the feature flag.
   * Default is `value`
   */
  variableKey?: string;
  /**
   * Attribute map to evaluate feature flags.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  fallBackDatafileUrl?: string;
  /**
   * @caution Make sure to send latest datafile only. Stale datafile might cause unexpected user experience
   */
  datafile?: object;
  /**
   * Default is 5000 ms
   */
  timeoutMs?: number;
  /**
   * By default read all enabled ones.
   */
  featureKeysToOverride?: string[];
  /**
   * Default log level is `WARNING`
   */
  logLevel?: 'NOTSET' | 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

  datafileOptions?: {
    autoUpdate?: boolean;
    updateInterval?: number;
  };

  initMode?: 'DATAFILE' | 'SDKKEY';
}
