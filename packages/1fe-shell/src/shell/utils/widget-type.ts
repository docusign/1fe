import { getShellWidgetId } from '../constants/shell';
import { PINNED_WIDGET_TYPE, SYSTEM_WIDGET_TYPE } from '../constants/widgets';
import { WidgetType } from '../types/widget-config';

export const isWidgetTypeSystem = (widgetType?: WidgetType): boolean =>
  widgetType === SYSTEM_WIDGET_TYPE;

export const isWidgetTypePinned = (widgetType?: WidgetType): boolean =>
  widgetType === PINNED_WIDGET_TYPE;

export const isShellWidget = (widgetId: string) =>
  widgetId === getShellWidgetId();
