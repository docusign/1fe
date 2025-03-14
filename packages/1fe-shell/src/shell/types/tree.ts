import { WidgetConfig } from './widget-config';

export type TreeNodeType =
  | `1FE_SHELL`
  | 'widget'
  | 'library'
  | 'bareSpecifier'
  | 'unknown';

export type WidgetTreeNode = {
  id: string;
  data: WidgetConfig;
  children?: WidgetTreeNode[];
};
