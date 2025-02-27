import { TreeNodeType } from '../types/tree';
import { WidgetConfig } from '../types/widget-config';

/**
 * An opaque identifier to ensure that we don't accidentally
 * compare it to another string.
 */
export type NodeId = 'opaque_node_id';

/**
 * Coerces a unique identifier to a {@link NodeId}.
 * TODO: Ideally we should use UUID or CUID here but due to a testing issue, this was dropped.
 */
const getNodeId = () => {
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  return `node-${random}` as NodeId;
};

/**
 * A node in a {@link Tree}.
 */
export class TreeNode<T> {
  private _data: T;

  public readonly id: NodeId;
  public readonly type: TreeNodeType;
  public readonly parents: Set<NodeId>;
  public readonly children: Set<NodeId>;

  public get data(): T {
    return this._data;
  }

  constructor(public readonly key: string, type: TreeNodeType, data: T) {
    this.id = getNodeId();
    this.type = type;
    this.parents = new Set();
    this.children = new Set();
    this._data = data;
  }

  update(data: T): void {
    this._data = data;
  }

  addChild(child: TreeNode<T>): void {
    this.children.add(child.id);
    child.parents.add(this.id);
  }

  addParent(parent: TreeNode<T>): void {
    this.parents.add(parent.id);
    parent.children.add(this.id);
  }

  removeChild(child: TreeNode<T>): void {
    this.children.delete(child.id);
    child.parents.delete(this.id);
  }

  removeParent(parent: TreeNode<T>): void {
    this.parents.delete(parent.id);
    parent.children.delete(this.id);
  }
}

export class Tree<T> {
  /**
   * Tracks all memory references to {@link TreeNode}s.
   */
  private readonly _refs: Map<NodeId, TreeNode<T>>;

  /**
   * Tracks all {@link TreeNode}s by their key.
   */
  private readonly keyMap: Map<string, NodeId>;

  /**
   * An empty node that serves as the root of the tree.
   */
  public readonly root: TreeNode<T>;

  constructor() {
    this._refs = new Map();
    this.keyMap = new Map();
    this.root = new TreeNode('#', '1DS_SHELL', {} as T);
  }

  get refs() {
    return this._refs;
  }

  /**
   * Given a key, returns the {@link TreeNode} associated with it.
   * NOTE: There's no getById since the id is opaque.
   */
  getByKey(key: string): TreeNode<T> | undefined {
    if (!key) {
      return;
    }
    const id = this.keyMap.get(key);
    if (id) {
      return this.refs.get(id);
    }
  }

  getById(id: NodeId): TreeNode<T> | undefined {
    return this.refs.get(id);
  }

  /**
   * Adds a new node to the tree.
   */
  add(
    key: string,
    data: T,
    nodeType: TreeNodeType,
    parent: TreeNode<T> = this.root,
  ): TreeNode<T> {
    let node = this.getByKey(key);
    if (!node) {
      node = new TreeNode(key, nodeType, data);
      this.refs.set(node.id, node);
      this.keyMap.set(key, node.id);
    } else {
      node.update(data);
    }
    if (parent) {
      parent.addChild(node);
    }
    return node;
  }

  /**
   * Removes a node from the tree.
   */
  remove(key: string): void {
    const node = this.getByKey(key);
    if (!node) {
      return;
    }
    for (const child of node.children) {
      this.refs.get(child)?.removeParent(node);
    }
    for (const parent of node.parents) {
      this.refs.get(parent)?.removeChild(node);
    }
    this.refs.delete(node.id);
    this.keyMap.delete(key);
  }

  /**
   * Returns an iterator over all nodes in the tree. The iterator
   * will yield the nodes in depth-first order.
   */
  *[Symbol.iterator](): Generator<[string, T]> {
    yield* this.dfs();
  }

  /**
   * Returns an iterator over all nodes in the tree. The iterator
   * will yield the nodes in depth-first order. The iterator can be started
   * at any node in the tree by passing in the key of the node to start at.
   */
  *dfs(key = ''): Generator<[string, T]> {
    const node = this.getByKey(key) ?? this.root;
    const visited = new Set<string>();
    const stack = [node];

    while (stack.length) {
      const top = stack.pop();
      if (!top) {
        return;
      }
      if (visited.has(top.id)) {
        continue;
      }
      visited.add(top.id);

      if (top !== this.root) {
        // Skip yielding the root node.
        yield [top.key, top.data];
      }

      top.children.forEach((id) => {
        const child = this.refs.get(id);
        if (child) {
          stack.push(child);
        }
      });
    }
  }
}

export const widgetDependencyTree = new Tree<WidgetConfig>();
export const widgetContextDependencyTree = new Tree<WidgetConfig>();
