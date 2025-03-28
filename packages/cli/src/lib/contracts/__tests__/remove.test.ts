import { removeContract } from '../remove';
import { FileSystem } from '../files';

jest.mock('fs-extra');
jest.mock('../files');
jest.mock('../registry');

describe('remove', () => {
  it('if contract is not found should say widget is not found', async () => {
    jest.mocked(FileSystem).mockImplementation(() => {
      return {
        ...jest.requireActual('../files').FileSystem,
        removeWidgetContract: jest.fn().mockResolvedValue(false),
      };
    });
    const result = await removeContract('@remove/me');
    expect(result).toEqual({
      type: 'WidgetNotFoundResult',
      widgetId: '@remove/me',
    });
  });

  it('should remove contract', async () => {
    jest.mocked(FileSystem).mockImplementation(() => {
      return {
        ...jest.requireActual('../files').FileSystem,
        removeWidgetContract: jest.fn().mockResolvedValue(true),
      };
    });

    const result = await removeContract('@remove/me');
    expect(result).toEqual({
      type: 'WidgetContractRemoved',
      widgetId: '@remove/me',
    });
  });
});
