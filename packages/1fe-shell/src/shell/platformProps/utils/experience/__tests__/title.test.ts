import { title } from '../title';

const mockError = jest.fn();
jest.mock('../../../../configs/shell-configs', () => ({
  readMagicBoxShellConfigs: jest.fn().mockImplementation(() => ({ 
    shellLogger: {
      log: jest.fn(),
      error: mockError,
      logPlatformUtilUsage: false
    }
  })),
}));

describe('title', () => {
  let originalDocBodyHtml = document.body.innerHTML;
  beforeEach(() => {
    originalDocBodyHtml = document.body.innerHTML;
  });

  afterEach(() => {
    document.body.innerHTML = originalDocBodyHtml;
  });

  it('should set the title of the document', () => {
    document.body.innerHTML = `
    <title id='oneds-title'></title>
  `;

    const testString = 'testing set';
    const titleElement = document.getElementById('oneds-title');
    title('widgetId').set(testString);

    expect(titleElement?.innerText).toBe(testString);
  });

  it('shoud log error if unable to set title', () => {
    title('@ds/test').set('foo');

    expect(mockError).toHaveBeenCalled();
  });

  it('should get the title of the document', () => {
    document.body.innerHTML = `
    <title id='oneds-title'></title>
  `;

    const testString = 'testing get';
    const titleElement = document.getElementById('oneds-title') as HTMLElement;
    titleElement.innerText = testString;

    const result = title('widgetId').get();
    expect(result).toBe(testString);
  });
});
