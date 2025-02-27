import { getHostWidget } from "..";
import { WidgetConfig } from "../../../../types/widget-config";

jest.mock('../../../../utils/tree', () => ({
  widgetDependencyTree: {
    root: {
      data: {
        widgetId: 'test',
        version: '1.0.0',
      },
      children: new Set().add('test99'),
    },
    refs: new Map()
      .set('test99', {
        key: 'test99',
        data: {
          widgetId: 'test99',
          version: '1.2.0',
        },
        children: new Set().add('test100'),
      })
      .set('test100', {
        key: 'test100',
        data: {
          widgetId: 'test100',
          version: '1.3.0',
        },
        children: new Set(),
      }),
    getByKey: () => ({ parents: new Set().add('test99') }),
    getById: () => ({
      key: 'test99',
      data: {
        widgetId: 'test99',
        version: '1.2.0',
      },
      children: new Set().add('test100'),
    }),
  },
}));

describe('getParent', () => {
  it('should return the correct parent widget', () => {
    const test99 = {
      key: 'test99',
      data: {
        widgetId: 'test99',
        version: '1.2.0',
      },
      children: new Set().add('test100'),
    };

    const widget: WidgetConfig = {
      widgetId: 'test100',
      version: '1.3.0',
      runtime: {},
    };
    const parent = getHostWidget(widget);
    expect(parent).toEqual({
      id: test99.key,
      data: test99.data,
    });
  });
});
