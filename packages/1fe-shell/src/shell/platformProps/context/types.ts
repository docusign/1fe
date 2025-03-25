import { WidgetConfig } from '../../types/widget-config';

export type WidgetTreeNode = {
  id: string;
  data: WidgetConfig;
  children?: WidgetTreeNode[];
};
