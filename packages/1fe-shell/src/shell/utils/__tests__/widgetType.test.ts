import { getShellWidgetId } from "../../constants/shell";
import { isShellWidget, isWidgetTypePinned, isWidgetTypeSystem } from "../widget-type";

describe('isWidgetTypeSystem', () => {
  it('should return true for system type widget', () => {
    const result = isWidgetTypeSystem('system');
    expect(result).toBe(true);
  });

  it('should return false for non system type widget', () => {
    const result = isWidgetTypeSystem();
    expect(result).toBe(false);
  });

  it('should return true for pinned type widget', () => {
    const result = isWidgetTypePinned('pinned');
    expect(result).toBe(true);
  });

  it('should return false for non pinned type widget', () => {
    const result = isWidgetTypePinned();
    expect(result).toBe(false);
  });
});

describe('isShellWidget', () => {
  it('should return true if widgetId is the app name', () => {
    expect(isShellWidget(getShellWidgetId())).toBe(true);
  });

  it('should return false if widgetId is not the app name', () => {
    expect(isShellWidget('some-other-widget')).toBe(false);
  });
});
