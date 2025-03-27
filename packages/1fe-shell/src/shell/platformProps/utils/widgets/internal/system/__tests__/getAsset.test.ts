import { isSystemEnv } from '../../utils/isSystem';
import { getAsset as _getAsset } from '../getAsset';

// jest.mock('../../../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

// jest.mock('../../../../../../utils/telemetry', () => ({
//   getShellLogger: () => ({
//     error: jest.fn(),
//     log: jest.fn(),
//   }),
// }));

jest.mock('../../../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

jest.mock('../../utils/isSystem');

const mockModule = { default: { foo: 'bar' } };

const _System = {
  import: jest.fn().mockResolvedValue(mockModule),
  resolve: jest.fn(),
} as unknown as typeof System;

const getAsset = _getAsset(_System, '@ds/tests');

describe('getByUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.mocked(isSystemEnv).mockReset();
  });

  it('should throw error if widget ID is missing', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(true);

    await expect(getAsset('', '/asdf')).rejects.toThrowError();
  });

  it('should throw error if its not a system env', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(false);

    await expect(getAsset('@ds/test', '/asdf')).rejects.toThrowError();
  });

  it('should throw error if its not a system env', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(true);

    await expect(getAsset('@ds/test', '/asdf')).rejects.toThrowError();
  });

  it('should catch and handle error getting bundle url', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(true);

    await expect(
      _getAsset(
        {
          import: () => {
            throw new Error('test');
          },
        } as any,
        '@ds/test',
      )('@ds/test', '/path'),
    ).rejects.toThrowError();
  });

  it('should call window.importMapOverrides.getCurrentPageMap if it exists', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(true);

    (window as any).importMapOverrides = {
      getCurrentPageMap: jest
        .fn()
        .mockResolvedValue({ imports: { '@ds/test': 'https://cdn.com' } }),
    };

    const result = await getAsset('@ds/test', '/path');
    expect(result).toEqual(mockModule);
  });
});
