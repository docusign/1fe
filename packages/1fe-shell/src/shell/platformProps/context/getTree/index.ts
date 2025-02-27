import { WidgetConfig } from '../../../types/widget-config';
import { TreeNode, widgetDependencyTree } from '../../../utils/tree';
import { WidgetTreeNode } from '../types';

export const createTree = (
  node: TreeNode<WidgetConfig>,
  itr: WidgetTreeNode[] = [],
  visitedNodes = new Set<string>(), // TODO: hack to prevent OOM error when multiple of the same widget are mounted
): WidgetTreeNode[] => {
  if (!node) {
    return itr;
  }
  // mark node visited
  // only nodes have IDs, child nodes have keys
  visitedNodes.add(node.id || node.key);

  const { widgetId, version } = node.data;

  // check if node is unmounted/still visible;
  if (
    node.type !== '1DS_SHELL' &&
    !document.querySelector(
      `div[data-qa="widget.frame"][data-widget-id="${widgetId}"][data-widget-version="${version}"]`,
    )
  ) {
    return itr;
  }
  const newNode = { id: widgetId || node.type, data: node.data, children: [] };
  itr.push(newNode);
  node.children.forEach((childNodeId) => {
    const childNode = widgetDependencyTree.refs.get(childNodeId);
    if (childNode && !visitedNodes.has(childNode.id))
      createTree(childNode, newNode.children, visitedNodes);
  });
  return itr;
};

export const getTree: () => WidgetTreeNode[] =
  /**
   * This utility function returns a tree of the 1DS_SHELL at the root, it's plugin and widget as its children
   * @returns {WidgetTree[]} - resultant tree reflecting the current state of the Shell
   */
  () => createTree(widgetDependencyTree.root);
