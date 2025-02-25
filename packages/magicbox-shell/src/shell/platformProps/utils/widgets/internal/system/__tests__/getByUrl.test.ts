import * as getComponentFromModuleModule from '../../utils/getComponentFromModule';
import { isSystemEnv } from '../../utils/isSystem';
import { getByUrl as _getByUrl } from '../getByUrl';

// jest.mock('../../../../../../utils/env-helpers', () => ({
//   getEnvironmentConfigs: jest.fn().mockImplementation(() => ({
//     FEATURE_FLAGS: {},
//   })),
// }));

// jest.mock('../../../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

jest.mock('../../utils/isSystem');

const mockModule = { default: { foo: 'bar' } };
const _System = {
  import: jest.fn().mockResolvedValue(mockModule),
} as unknown as typeof System;

const getByUrl = _getByUrl(_System, '@ds/tests');

describe('getByUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.mocked(isSystemEnv).mockReset();
  });

  it('should throw error if it is not a system env', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(false);

    await expect(getByUrl(new URL('https://cdn.com'))).rejects.toThrowError();
  });

  it('should throw error if url parameter is undefined', async () => {
    jest.mocked(isSystemEnv).mockReturnValueOnce(false);

    await expect(getByUrl(undefined as any)).rejects.toThrowError();
  });

  it('should return component from module', async () => {
    jest.mocked(isSystemEnv).mockReturnValue(true);

    const result = await getByUrl(new URL('https://cdn.com'));
    expect(result).toEqual({ default: { foo: 'bar' } });
  });

  it('catch and handle error getting component from module ', async () => {
    jest.mocked(isSystemEnv).mockReturnValue(true);
    jest
      .spyOn(getComponentFromModuleModule, 'getComponentFromModule')
      .mockImplementationOnce(() => {
        throw new Error('asdf');
      });

    await expect(getByUrl(new URL('https://cdn.com'))).rejects.toThrowError();
  });
});
