import { _customMark, _measure, getAppLoadTimeUtils } from '..';
import * as mockableAppLoadTimeObject from '..';
import { isShellWidget } from '../../../../utils/widget-type';
import { ShellAppLoadTimeUtils, WidgetAppLoadTimeUtils } from '../types';

jest.mock('../../../../utils/url', () => ({
  ...jest.requireActual('../../../../utils/url'),
  getBaseHrefUrl: jest.fn(() => 'https://apps.docusign.com/'),
  basePathname: jest.fn(() => '/'),
}));

jest.mock('../../../../utils/widget-type', () => ({
  ...jest.requireActual('../../../../utils/widget-type'),
  isShellWidget: jest.fn(),
}));

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockImplementation(() => ({
    isProduction: false,
    shellLogger: {
      logPlatformUtilUsage: false,
      log: jest.fn(),
      error: jest.fn(),
    },
  })),
}));

describe('appLoadTimeUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.window.performance.mark = jest.fn();
    global.window.performance.measure = jest.fn();
    global.window.performance.getEntries = jest.fn();
  });

  describe('_customMark', () => {
    it('should call global.window.performance.mark with markName and measureOptions', () => {
      const markName = 'testMark';
      const measureOptions = { detail: 'testDetail' };

      _customMark(markName, measureOptions);

      expect(window.performance.mark).toHaveBeenCalledWith(
        markName,
        measureOptions,
      );
    });
  });

  describe('_measure', () => {
    it('should call global.window.performance.measure with measureName and measureOptions', () => {
      const measureName = 'testMeasure';
      const measureOptions = { start: 'startMark', end: 'endMark' };
      const mockMeasureResult = { name: 'testMeasure', duration: 123 };

      (window.performance.measure as jest.Mock).mockReturnValue(
        mockMeasureResult,
      );

      const result = _measure(measureName, measureOptions);

      expect(window.performance.measure).toHaveBeenCalledWith(
        measureName,
        measureOptions,
      );
      expect(result).toEqual(mockMeasureResult);
    });
  });

  describe('getAppLoadTimeUtils', () => {
    describe('when isShellWidget is true', () => {
      const shellWidgetId = '@1fe/shell';

      beforeEach(() => {
        jest.mocked(isShellWidget).mockReturnValue(true);
      });

      it('should return ShellAppLoadTimeUtils', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<ShellAppLoadTimeUtils>(shellWidgetId);

        expect(appLoadTimeUtils).toHaveProperty('markStart');
        expect(appLoadTimeUtils).toHaveProperty('markEnd');

        expect(appLoadTimeUtils).not.toHaveProperty('mark');
        expect(appLoadTimeUtils).not.toHaveProperty('end');
        expect(appLoadTimeUtils).not.toHaveProperty('getEntries');
        expect(appLoadTimeUtils).not.toHaveProperty('measure');
      });

      it('should call markStart with proper parameters, , with widgetID not attached', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<ShellAppLoadTimeUtils>(shellWidgetId);
        const markerName = 'testMarker';
        const markOptions = { detail: 'testDetail' };

        jest.spyOn(mockableAppLoadTimeObject, '_customMark');

        appLoadTimeUtils.markStart(markerName, markOptions);

        expect(_customMark).toHaveBeenCalledWith(
          `${markerName}-start`,
          markOptions,
        );
      });

      it('should call markEnd with proper parameters and log the result, with widgetID not attached', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<ShellAppLoadTimeUtils>(shellWidgetId);
        const markerName = 'testMarker';
        const markOptions = { detail: 'testDetail' };
        const mockMeasureResult = { name: 'testMeasure', duration: 123 };

        jest.spyOn(mockableAppLoadTimeObject, '_customMark');
        jest.spyOn(mockableAppLoadTimeObject, '_measure');

        (window.performance.getEntries as jest.Mock).mockReturnValue([
          { entryType: 'mark', name: `${markerName}-start` },
        ]);

        (window.performance.measure as jest.Mock).mockReturnValue(
          mockMeasureResult,
        );

        const result = appLoadTimeUtils.markEnd(markerName, markOptions);

        expect(_customMark).toHaveBeenCalledWith(
          `${markerName}-end`,
          markOptions,
        );
        expect(_measure).toHaveBeenCalledWith(markerName, {
          ...{ start: `${markerName}-start`, end: `${markerName}-end` },
          ...markOptions,
        });
        expect(result).toEqual(mockMeasureResult);
      });
    });

    describe('when isShellWidget is false', () => {
      const widgetId = 'testWidgetId';

      beforeEach(() => {
        (isShellWidget as jest.Mock).mockReturnValue(false);
      });

      it('should return WidgetAppLoadTimeUtils', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);

        expect(appLoadTimeUtils).toHaveProperty('mark');
        expect(appLoadTimeUtils).toHaveProperty('end');
        expect(appLoadTimeUtils).toHaveProperty('getEntries');
        expect(appLoadTimeUtils).toHaveProperty('measure');
        expect(appLoadTimeUtils).toHaveProperty('markStart');
        expect(appLoadTimeUtils).toHaveProperty('markEnd');
      });

      it('should call mark with proper parameters', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const markerName = 'testMarker';
        const markOptions = { detail: 'testDetail' };

        jest.spyOn(mockableAppLoadTimeObject, '_customMark');

        appLoadTimeUtils.mark(markerName, markOptions);

        expect(_customMark).toHaveBeenCalledWith(markerName, markOptions);
      });

      it('should call end() with proper parameters', async () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const mockMeasureResult = { name: 'testMeasure', duration: 123 };
        jest.spyOn(mockableAppLoadTimeObject, '_customMark');

        (global.window.performance.getEntries as jest.Mock).mockReturnValue([
          { entryType: 'mark', name: `${widgetId}-start` },
        ]);

        (_measure as jest.Mock).mockReturnValue(mockMeasureResult);

        const result = appLoadTimeUtils.end();

        const secondCallResult = appLoadTimeUtils.end();

        expect(_customMark).toHaveBeenCalledWith(`${widgetId}-end`, {});
        expect(_customMark).toBeCalledTimes(1);

        expect(_measure).toHaveBeenCalledWith(widgetId, {
          ...{ start: `${widgetId}-start`, end: `${widgetId}-end` },
        });
        expect(_measure).toBeCalledTimes(1);
        expect(result).toEqual(mockMeasureResult);
        expect(secondCallResult).toEqual(result);
      });

      it('should call getEntries', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const mockEntries = [{ name: 'testEntry', duration: 123 }];

        (global.window.performance.getEntries as jest.Mock).mockReturnValue(
          mockEntries,
        );

        const entries = appLoadTimeUtils.getEntries();

        expect(window.performance.getEntries).toHaveBeenCalled();
        expect(entries).toEqual(mockEntries);
      });

      it('should call measure with proper parameters', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const measureName = 'testMeasure';
        const measureOptions = { start: 'startMark', end: 'endMark' };
        const mockMeasureResult = { name: 'testMeasure', duration: 123 };

        const result = appLoadTimeUtils.measure(measureName, measureOptions);

        expect(result).toEqual(mockMeasureResult);
      });

      it('should call markStart() with proper parameters, , with widgetID attached', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const markerName = 'testMarker';
        const markOptions = { detail: 'testDetail' };
        jest.spyOn(mockableAppLoadTimeObject, '_customMark');

        appLoadTimeUtils.markStart(markerName, markOptions);

        expect(_customMark).toHaveBeenCalledWith(
          `${widgetId}-${markerName}-start`,
          markOptions,
        );
      });

      it('should call markEnd with proper parameters and log the result, with widgetID attached', () => {
        const appLoadTimeUtils =
          getAppLoadTimeUtils<WidgetAppLoadTimeUtils>(widgetId);
        const markerName = 'testMarker';
        const finalMarkerName = `${widgetId}-${markerName}`;

        const markOptions = { detail: 'testDetail' };
        const mockMeasureResult = { name: 'testMeasure', duration: 123 };

        jest.spyOn(mockableAppLoadTimeObject, '_customMark');
        jest.spyOn(mockableAppLoadTimeObject, '_measure');

        (window.performance.getEntries as jest.Mock).mockReturnValue([
          { entryType: 'mark', name: `${finalMarkerName}-start` },
        ]);

        (window.performance.measure as jest.Mock).mockReturnValue(
          mockMeasureResult,
        );

        const result = appLoadTimeUtils.markEnd(markerName, markOptions);

        expect(_customMark).toHaveBeenCalledWith(
          `${finalMarkerName}-end`,
          markOptions,
        );
        expect(_measure).toHaveBeenCalledWith(finalMarkerName, {
          ...{
            start: `${finalMarkerName}-start`,
            end: `${finalMarkerName}-end`,
          },
          ...markOptions,
        });
        expect(result).toEqual(mockMeasureResult);
      });
    });
  });
});
