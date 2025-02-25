import { getAbsoluteWidgetPath } from '../get-absolute-widget-path';

jest.mock('../../../../utils/url', () => ({
  getBaseHrefUrl: () => 'https://services.dev.docusign.net/1ds-app/v1.0/',
}));

describe('getAbsoluteWidgetPath', () => {
  const hrefsToTest = [
    'https://services.dev.docusign.net/1ds-app/v1.0/send/asdf/asdf',
    'https://services.dev.docusign.net/1ds-app/v1.0/send/asdf/asdf/',
    'https://services.dev.docusign.net/1ds-app/v1.0/send',
    'https://services.dev.docusign.net/1ds-app/v1.0/send/',
  ];

  test.each(hrefsToTest)(
    'should return absolute widget path from href: %s',
    (href) => {
      window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          href,
        },
        writable: true,
      });

      expect(getAbsoluteWidgetPath()).toBe(
        'https://services.dev.docusign.net/1ds-app/v1.0/send',
      );
    },
  );

  test('should return full path when getFullpath param is passed', () => {
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://services.dev.docusign.net/1ds-app/v1.0/send/foo/bar',
      },
      writable: true,
    });
    expect(getAbsoluteWidgetPath(true)).toBe(
      'https://services.dev.docusign.net/1ds-app/v1.0/send/foo/bar',
    );
  });
});
