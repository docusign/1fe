import { Tree } from '../tree';

describe('Tree', () => {
  let tree: Tree<number>;

  beforeEach(() => {
    tree = new Tree<number>();
  });

  it('should create a new tree', () => {
    expect(tree).toBeDefined();
  });

  it('should add a new node to the tree', () => {
    const node = tree.add('key1', 1, 'widget');
    expect(node).toBeDefined();
    expect(node.data).toBe(1);
    expect(tree.getByKey('key1')).toBe(node);
  });

  it('should update and existing node if the key is same', () => {
    const node1 = tree.add('key1', 1, 'widget');
    const node2 = tree.add('key1', 2, 'widget');
    expect(node2).toBe(node1);
    expect(node1.data).toBe(2);
  });

  it('should remove a node from the tree', () => {
    tree.add('key1', 1, 'widget');
    tree.remove('key1');
    expect(tree.getByKey('key1')).toBeUndefined();
  });

  it('should not remove a node that does not exist', () => {
    tree.remove('key1');
    expect(tree.getByKey('key1')).toBeUndefined();
  });

  it('should iterate over all nodes in the tree', () => {
    tree.add('key1', 1, 'widget');
    tree.add('key2', 2, 'widget');
    tree.add('key3', 3, 'widget');

    const nodes = Array.from(tree);
    expect(nodes).toEqual([
      ['key3', 3],
      ['key2', 2],
      ['key1', 1],
    ]);
  });

  it('should perform a depth-first search', () => {
    const node1 = tree.add('key1', 1, 'widget');
    const node2 = tree.add('key2', 2, 'widget', node1);
    tree.add('key3', 3, 'widget', node2);

    const nodes = Array.from(tree.dfs('key2'));
    expect(nodes).toEqual([
      ['key2', 2],
      ['key3', 3],
    ]);
  });

  it('should add a child to a parent node', () => {
    const parentNode = tree.add('parent', 1, 'widget');
    const childNode = tree.add('child', 2, 'widget', parentNode);
    expect(parentNode.children.size).toBe(1);
    expect(childNode.parents.size).toBe(1);
  });

  it('should not add a child to a non-existent parent', () => {
    const key = tree.getByKey('non-existent');

    const childNode = tree.add('child', 2, 'widget', key);
    expect(childNode.parents.size).toBe(1);
  });

  it('should remove a parent from a child node', () => {
    const parentNode = tree.add('parent', 1, 'widget');
    const childNode = tree.add('child', 2, 'widget', parentNode);
    tree.remove('parent');
    expect(childNode.parents).not.toContain(parentNode.id);
  });

  it('should not remove a non-existent node', () => {
    tree.remove('non-existent');
    expect(tree.getByKey('non-existent')).toBeUndefined();
  });
});
