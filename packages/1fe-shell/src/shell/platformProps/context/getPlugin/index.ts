import { getTree } from '../getTree';
import { WidgetTreeNode } from '../types';

/**
 * There can only be one plugin mounted in the shell at a time.
 * This utility function returns the plugin mounted in the shell
 * @returns {WidgetTreeNode | null} - the plugin mounted in the shell
 */
export const getPlugin = (): WidgetTreeNode | null => {
  const tree = getTree();
  const shell = tree.find((node) => node.id === '1DS_SHELL');

  const shellChildren = shell?.children as WidgetTreeNode[];

  if (!shell || !shellChildren?.length) {
    return null;
  }

  const [mountedPlugin] = shellChildren;

  return {
    id: mountedPlugin.id,
    data: mountedPlugin.data,
  };
};
