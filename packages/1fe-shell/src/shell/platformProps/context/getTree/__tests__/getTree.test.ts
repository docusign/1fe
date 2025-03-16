import { createTree } from '..';
import { WidgetConfig } from '../../../../types/widget-config';
import { Tree } from '../../../../utils/tree';

jest.mock('crypto', () => ({
  getRandomValues: (_arr: Uint8Array) => {
    return [421];
  },
}));

jest.mock('../../../../utils/tree', () => ({
  ...jest.requireActual('../../../../utils/tree'),
  widgetDependencyTree: {
    root: {
      data: {
        widgetId: 'test',
        version: '1.0.0',
      },
      children: [],
    },
    refs: {
      get: (childNodeId: string) => {
        const fakeChild = new Set();
        const childNodeIdCounter = parseInt(childNodeId.split(':')[1]) || 0;
        const newChildNodeId = `test:${childNodeIdCounter + 1}`;

        if (childNodeIdCounter < 5) {
          fakeChild.add(newChildNodeId);
        }

        return {
          key: childNodeId,
          data: {
            widgetId: newChildNodeId,
            version: '1.0.0',
          },
          children: fakeChild,
        };
      },
    },
  },
}));

describe('createTree', () => {
  it('should return the correct root', () => {
    jest.mock('../../../../utils/tree', () => ({
      widgetDependencyTree: {
        root: {
          data: {
            widgetId: 'test',
            version: '1.0.0',
          },
          children: [],
        },
        refs: new Map(),
      },
    }));

    const rootNode = new Tree<WidgetConfig>();
    const tree = createTree(rootNode.root);

    expect(tree).toEqual([
      {
        id: '1FE_SHELL',
        // data is empty for the root node
        data: {},
        children: [],
      },
    ]);
  });

  it('should return the tree with first child if other children are not visible in the DOM', () => {
    jest
      .spyOn(document, 'querySelector')
      // only for the first child check
      .mockImplementationOnce((_selector: string) => {
        return true as unknown as Element;
      });

    const dataWidget = {
      widgetId: 'test0',
      version: '2.0.0',
      activePhasedDeployment: false,
      runtime: {},
    };

    const rootNode = new Tree<WidgetConfig>();
    const childNode = rootNode.add(
      'test0',
      dataWidget,
      'widget',
      rootNode.root,
    );
    const child2Node = rootNode.add('test2', dataWidget, 'widget', childNode);
    const child3Node = rootNode.add('test3', dataWidget, 'widget', child2Node);
    const child99Node = rootNode.add(
      'test99',
      dataWidget,
      'widget',
      child3Node,
    );
    rootNode.add('test4', dataWidget, 'widget', child99Node);

    jest.mock('../../../utils', () => ({
      widgetDependencyTree: rootNode,
    }));

    const tree = createTree(rootNode.root);

    expect(tree).toEqual([
      {
        id: '1FE_SHELL',
        data: {},
        children: [
          {
            id: 'test:1',
            data: {
              widgetId: 'test:1',
              version: '1.0.0',
            },
            children: [],
          },
        ],
      },
    ]);
  });

  it('should return the correct tree with mocked widgetDependencyTree', () => {
    const dataWidget = {
      widgetId: 'test0',
      version: '2.0.0',
      activePhasedDeployment: false,
      runtime: {},
    };

    jest
      .spyOn(document, 'querySelector')
      .mockImplementation((_selector: string) => {
        return true as unknown as Element;
      });

    const rootNode = new Tree<WidgetConfig>();
    const childNode = rootNode.add(
      'test0',
      dataWidget,
      'widget',
      rootNode.root,
    );
    const child2Node = rootNode.add('test2', dataWidget, 'widget', childNode);
    const child3Node = rootNode.add('test3', dataWidget, 'widget', child2Node);
    const child99Node = rootNode.add(
      'test99',
      dataWidget,
      'widget',
      child3Node,
    );
    rootNode.add('test4', dataWidget, 'widget', child99Node);

    jest.mock('../../../utils', () => ({
      widgetDependencyTree: rootNode,
    }));

    const tree = createTree(rootNode.root);

    expect(tree).toEqual([
      {
        id: '1FE_SHELL',
        data: {},
        children: [
          {
            id: 'test:1',
            data: {
              widgetId: 'test:1',
              version: '1.0.0',
            },
            children: [
              {
                id: 'test:2',
                data: {
                  widgetId: 'test:2',
                  version: '1.0.0',
                },
                children: [
                  {
                    id: 'test:3',
                    data: {
                      widgetId: 'test:3',
                      version: '1.0.0',
                    },
                    children: [
                      {
                        id: 'test:4',
                        data: {
                          widgetId: 'test:4',
                          version: '1.0.0',
                        },
                        children: [
                          {
                            id: 'test:5',
                            data: {
                              widgetId: 'test:5',
                              version: '1.0.0',
                            },
                            children: [
                              {
                                id: 'test:6',
                                data: {
                                  widgetId: 'test:6',
                                  version: '1.0.0',
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
