export type InternalLogData = {
  /**
   * The utils name
   */
  category: `utils.${string}.${string}`;

  /**
   * Any message to include
   */
  message: string;

  // widgetId, sessionId, location, and isBrowser attached by default
  metaData?: {
    /**
     * The parameters used in the utils function call
     */
    arguments?: Record<string, unknown>;

    /**
     * Any other data you want to log should go here
     */
    other?: Record<string, unknown>;
  };
};

export type ShellAppLoadTimeUtils = {
  /**
   * Used for starting a performance mark within 1FE-Shell
   */
  markStart: (markerName: string, markOptions?: PerformanceMarkOptions) => void;

  /**
   * Used for ending and measuring an open performance mark within 1FE-Shell
   */
  markEnd: (
    markerName: string,
    markOptions?: PerformanceMarkOptions,
  ) => PerformanceMeasure | undefined;
};

export type WidgetAppLoadTimeUtils = {
  /**
   * Used for starting a performance mark within a widget. In most cases you should use MarkStart and MarkEnd instead
   */
  mark: (markName: string, measureOptions?: PerformanceMeasureOptions) => void;

  /**
   * Used to end the primary performance mark started by the 1FE-Shell. Should only be called once
   */
  end: () => void;

  /**
   * Used for measuring the duration of 1 or more marks within a widget
   */
  measure: (
    measureName: string,
    measureOptions: PerformanceMeasureOptions,
  ) => PerformanceMeasure | undefined;

  /**
   * Used to get a list of all performance entries
   */
  getEntries: () => PerformanceEntryList;

  /**
   * Starts a custom performance mark
   */
  markStart: (markerName: string, markOptions?: PerformanceMarkOptions) => void;

  /**
   * Ends and measures a custom performance mark
   */
  markEnd: (
    markerName: string,
    markOptions?: PerformanceMarkOptions,
  ) => PerformanceMeasure | undefined;
};
