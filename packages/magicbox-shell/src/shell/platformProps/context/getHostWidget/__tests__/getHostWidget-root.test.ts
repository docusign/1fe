import { getHostWidget } from "..";
import { WidgetConfig } from "../../../../types/widget-config";

jest.mock('../../../utils', () => ({
  widgetDependencyTree: {
    root: {
      data: {
        widgetId: 'test',
        version: '1.0.0',
      },
      children: [],
    },
    refs: new Map(),
    getByKey: () => ({ parents: new Set() }),
  },
}));

describe('getParent', () => {
  it('should return the null if there is no parent', () => {
    const widget: WidgetConfig = {
      widgetId: 'test',
      version: '1.0.0',
      runtime: {},
    };
    const parent = getHostWidget(widget);
    expect(parent).toEqual(null);
  });
});
