import { WidgetConfig } from '../../../types/widget-config';
import { NodeId, widgetDependencyTree } from '../../../utils/tree';
import { WidgetTreeNode } from '../types';

/**
 * This utility function returns the immediate parent of the calling widget
 * Writing logic specific to which parent widget loads you is *HIGHLY DISCOURAGED!*
 * @returns {WidgetTreeNode | null} - the parent widget
 */
export const getHostWidget = (widget: WidgetConfig): WidgetTreeNode | null => {
  // first get the immediate parent of the caller widget
  const immediateHostWidgetNodeId = widgetDependencyTree
    .getByKey(widget.widgetId) // to be replaced with a widget's unique id that is an amalgamation of widgetId and treeNode.id
    ?.parents.keys()
    .next().value as NodeId;

  // if no immediate parent, return null
  // ex: plugins
  if (!immediateHostWidgetNodeId) {
    return null;
  }
  // get the node from the tree of the immediate parent
  const node = widgetDependencyTree.getById(immediateHostWidgetNodeId);
  if (!node) {
    return null;
  }
  // return the node in the format expected by the platform.context prop
  return {
    id: node.key,
    data: node.data,
  };
};
