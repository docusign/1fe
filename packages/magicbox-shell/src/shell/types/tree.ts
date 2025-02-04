import { WidgetConfig } from "./widget-config";

export type TreeNodeType =
  | `1DS_SHELL`
  | 'widget'
  | 'library'
  | 'bareSpecifier'
  | 'unknown';

  export type WidgetTreeNode = {
    id: string;
    data: WidgetConfig;
    children?: WidgetTreeNode[];
  };
  