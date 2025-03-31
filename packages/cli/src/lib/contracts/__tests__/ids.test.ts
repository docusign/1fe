import { isVersionedWidgetId, parseVersionedWidgetId } from '../ids';
import type { WidgetId } from '../types';

describe('ids', () => {
  describe('parseVersion', () => {
    it('splits version by @ sign', () => {
      expect(parseVersionedWidgetId('@shared/filter-bar@1.2.3')).toEqual({
        widgetId: '@shared/filter-bar',
        version: '1.2.3',
      });
    });
  });

  describe('isVersionedWidgetId', () => {
    it.each<[WidgetId, boolean]>([
      ['@shared/filter-bar@1.2.3', true],
      ['@shared/filter-bar@1.2.3-14', true],
      ['@shared/filter-bar', false],
    ])(
      'returns value if it meets the format criteria of two @ symbols',
      (widgetId, expected) => {
        expect(isVersionedWidgetId(widgetId)).toEqual(expected);
      },
    );
  });
});
