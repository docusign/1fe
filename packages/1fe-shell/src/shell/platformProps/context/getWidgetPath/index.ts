import { ONE_FE_SHELL_ID } from '../../../constants/event-bus';
import { NodeId, widgetDependencyTree } from '../../../utils/tree';

/**
 * return all widget IDs in the path to your location in the tree
 * @param widgetId
 * @returns array of widget IDs
 */
export const getWidgetPath = (widgetId: string): string[] => {
  const path: string[] = [];

  // TODO: .getByKey trips up when the same widget appears twice in the same path
  // e.g. generic-child-widget recursively nested inside itself
  let current = widgetDependencyTree.getByKey(widgetId);

  while (current != null) {
    path.push(current.data.widgetId);
    const parentNodeId = current.parents.keys().next().value as NodeId;
    current = widgetDependencyTree.getById(parentNodeId);
  }

  // returns in "widget up to shell" order
  return [...path, ONE_FE_SHELL_ID];
};
