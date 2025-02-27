import { getWidgetPath } from "..";
import { ONE_FE_SHELL_ID } from "../../../../constants/event-bus";
import { widgetDependencyTree } from "../../../../utils/tree";

describe('getWidgetPath', () => {
  it('should return the correct widget path with only a root node', () => {
    widgetDependencyTree.add(
      '@ds/root',
      {
        runtime: {},
        version: '1.2.1',
        widgetId: '@ds/root',
      },
      'widget',
    );

    const path = getWidgetPath('@ds/root');
    expect(path).toEqual(['@ds/root', ONE_FE_SHELL_ID]);
  });

  it('should return the correct widget path with 2 nodes', () => {
    const rootNode = widgetDependencyTree.add(
      '@ds/root',
      {
        runtime: {},
        version: '1.2.1',
        widgetId: '@ds/root',
      },
      'widget',
    );

    widgetDependencyTree.add(
      '@ds/child1',
      {
        runtime: {},
        version: '1.2.4',
        widgetId: '@ds/child1',
      },
      'widget',
      rootNode,
    );

    const path = getWidgetPath('@ds/child1');
    expect(path).toEqual(['@ds/child1', '@ds/root', ONE_FE_SHELL_ID]);
  });

  it('should return the correct widget path with 3 nodes', () => {
    const rootNode = widgetDependencyTree.add(
      '@ds/root',
      {
        runtime: {},
        version: '1.2.1',
        widgetId: '@ds/root',
      },
      'widget',
    );

    const childNode1 = widgetDependencyTree.add(
      '@ds/child1',
      {
        runtime: {},
        version: '1.2.4',
        widgetId: '@ds/child1',
      },
      'widget',
      rootNode,
    );

    widgetDependencyTree.add(
      '@ds/child2',
      {
        runtime: {},
        version: '1.2.7',
        widgetId: '@ds/child2',
      },
      'widget',
      childNode1,
    );

    const path = getWidgetPath('@ds/child2');
    expect(path).toEqual([
      '@ds/child2',
      '@ds/child1',
      '@ds/root',
      ONE_FE_SHELL_ID,
    ]);
  });

  // TODO: due to getByKey functionality, if the same widget is nested inside itself, the widget path does not reflect that
  //   it.skip('should return the correct widget path with 3 nodes + duplicate IDs', () => {
  //     const rootNode = widgetDependencyTree.add(
  //       '@ds/root',
  //       {
  //         activePhasedDeployment: false,
  //         runtime: {},
  //         version: '1.2.1',
  //         widgetId: '@ds/root',
  //       },
  //       'widget',
  //     );

  //     const childNode1 = widgetDependencyTree.add(
  //       '@ds/repeated',
  //       {
  //         activePhasedDeployment: false,
  //         runtime: {},
  //         version: '1.2.4',
  //         widgetId: '@ds/repeated',
  //       },
  //       'widget',
  //       rootNode,
  //     );

  //     widgetDependencyTree.add(
  //       '@ds/repeated',
  //       {
  //         activePhasedDeployment: false,
  //         runtime: {},
  //         version: '1.2.7',
  //         widgetId: '@ds/repeated',
  //       },
  //       'widget',
  //       childNode1,
  //     );

  //     const path = getWidgetPath('@ds/child2');
  //     // TODO:
  //     // expected path result is ['@ds/repeated', '@ds/repeated', '@ds/root'],
  //     // currently it returns ['@ds/repeated', '@ds/root']
  //     expect(path).toEqual(['@ds/repeated', '@ds/repeated', '@ds/root']);
  //   });
});
