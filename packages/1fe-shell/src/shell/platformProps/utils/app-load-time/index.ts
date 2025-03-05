import { once } from 'lodash';

import { getShellLogger } from '../../../utils/telemetry';
import { logPlatformUtilUsage } from '../logPlatformUtilUsage';

import { ShellAppLoadTimeUtils, WidgetAppLoadTimeUtils } from './types';
import { isShellWidget } from '../../../utils/widget-type';
import { getSessionIdFromCookie } from '../../../utils/cookie-helpers';
import { readMagicBoxShellConfigs } from '../../../configs/shell-configs';

export const _customMark = (
  markName: string,
  measureOptions: PerformanceMarkOptions = {},
): void => {
  window.performance?.mark(markName, measureOptions);

  if (readMagicBoxShellConfigs().mode !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[1ds][util][appLoadTime] mark: ' + markName);
  }
};

export const _measure = (
  measureName: string,
  measureOptions?: PerformanceMeasureOptions,
): PerformanceMeasure | undefined => {
  try {
    return window.performance?.measure(measureName, measureOptions);
  } catch (err) {
    console.error('[1ds][util][appLoadTime] measure error', err);
  }
};

export const getAppLoadTimeUtils = <
  ReturnT extends ShellAppLoadTimeUtils | WidgetAppLoadTimeUtils,
>(
  widgetId: string,
): ReturnT => {
  const logger = getShellLogger();

  const markStart =
    (consumingWidgetId?: string) =>
    (markerName: string, markOptions: PerformanceMarkOptions = {}): void => {
      const finalMarkerName =
        consumingWidgetId !== undefined
          ? `${consumingWidgetId}-${markerName}`
          : markerName;

      const startMark = `${finalMarkerName}-start`;

      _customMark(startMark, markOptions);
    };

  const markEnd =
    (consumingWidgetId?: string) =>
    (
      markerName: string,
      markOptions: PerformanceMarkOptions = {},
    ): PerformanceMeasure | undefined => {
      try {
        const activeMarkers = window.performance
          ?.getEntries()
          .filter((entry) => entry.entryType === 'mark')
          .map((entry) => entry.name);

        const finalMarkerName =
          consumingWidgetId !== undefined
            ? `${consumingWidgetId}-${markerName}`
            : markerName;

        const startMark = `${finalMarkerName}-start`;

        if (!activeMarkers.includes(startMark)) {
          console.error(
            `[1ds][util][appLoadTime] markEnd called before markStart for ${markerName}`,
          );
          return;
        }

        const endMark = `${finalMarkerName}-end`;

        _customMark(endMark, markOptions);

        const measure = _measure(finalMarkerName, {
          ...{ start: startMark, end: endMark },
          ...markOptions,
        });

        logger.log({
          markOptions,
          widgetId,
          measure,
          message: `[1DS][WIDGET] appLoadTime data recorded for ${markerName}`,
          // Including metaData to maintain old shape. Some of this is available in the shell logger's baseLogObject
          metaData: {
            widgetId,
            sessionId: getSessionIdFromCookie(),
            isBrowser: typeof window !== 'undefined',
          },
        });

        logPlatformUtilUsage({
          utilNamespace: 'appLoadTime',
          functionName: 'end',
          widgetId,
        });

        return measure;
      } catch (err) {
        console.error('[1ds][util][appLoadTime] markEnd error', err);
      }
    };

  const getEntries = (): PerformanceEntryList => {
    return window.performance?.getEntries();
  };

  if (isShellWidget(widgetId)) {
    return {
      markStart: markStart(),
      markEnd: markEnd(),
    } as ReturnT;
  }
  return {
    mark: _customMark,
    end: once(() => markEnd()(widgetId)),
    getEntries,
    measure: _measure,
    markStart: markStart(widgetId),
    markEnd: markEnd(widgetId),
  } as ReturnT;
};
