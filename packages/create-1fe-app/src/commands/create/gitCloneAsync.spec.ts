import { gitCloneAsync } from './gitCloneAsync';
import simpleGit from 'simple-git';

jest.mock('simple-git');

describe('gitCloneAsync', () => {
  const mockClone = jest.fn();

  beforeEach(() => {
    (simpleGit as jest.Mock).mockReturnValue({
      clone: mockClone,
    });
    mockClone.mockReset();
  });

  it('resolves when git.clone succeeds', async () => {
    mockClone.mockImplementation((_url, _path, _opts, cb) => cb(null));
    await expect(
      gitCloneAsync('https://example.com/repo.git', '/tmp/repo'),
    ).resolves.toBeUndefined();
    expect(mockClone).toHaveBeenCalledWith(
      'https://example.com/repo.git',
      '/tmp/repo',
      ['--depth', '1', '--single-branch'],
      expect.any(Function),
    );
  });

  it('rejects when git.clone fails', async () => {
    const error = new Error('clone failed');
    mockClone.mockImplementation((_url, _path, _opts, cb) => cb(error));
    await expect(
      gitCloneAsync('https://example.com/repo.git', '/tmp/repo'),
    ).rejects.toThrow('clone failed');
  });
});
