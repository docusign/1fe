import { join } from 'path';
import * as getLoggerModule from '../../lib/getLogger';
import * as gitUtilsModule from '../../lib/git-utils';
import * as gitCloneAsyncModule from './gitCloneAsync';
import * as fs from 'fs';
import { createAction } from './create-action';

jest.mock('../../lib/getLogger');
jest.mock('../../lib/git-utils');
jest.mock('./gitCloneAsync');
jest.mock('fs');

describe('createAction', () => {
  const mockLogger = {
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const appName = 'my-app';
  const gitProtocol = 'https';
  const debug = false;
  const trace = false;
  const cloneUrl = 'https://github.com/docusign/1fe-starter-app.git';
  const clonePath = join(process.cwd(), appName);

  beforeEach(() => {
    jest.clearAllMocks();
    (getLoggerModule.getLogger as jest.Mock).mockReturnValue(mockLogger as any);
    (gitUtilsModule.getGitCloneUrl as jest.Mock).mockReturnValue(cloneUrl);
    (gitCloneAsyncModule.gitCloneAsync as jest.Mock).mockResolvedValue(
      undefined,
    );
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.rmSync as jest.Mock).mockImplementation(() => {});
  });

  it('clones the repo, removes .git, and logs success', async () => {
    await createAction(appName, { gitProtocol, debug, trace });

    expect(gitUtilsModule.getGitCloneUrl).toHaveBeenCalledWith(gitProtocol);
    expect(gitCloneAsyncModule.gitCloneAsync).toHaveBeenCalledWith(
      cloneUrl,
      clonePath,
    );
    expect(fs.rmSync).toHaveBeenCalledWith(join(clonePath, '.git'), {
      recursive: true,
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/repository cloned successfully/gi),
    );
  });

  it('logs error if gitCloneAsync fails', async () => {
    (gitCloneAsyncModule.gitCloneAsync as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    await expect(
      createAction(appName, { gitProtocol, debug, trace }),
    ).rejects.toThrow(/fail/gi);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/fail/gi),
      expect.anything(),
    );
  });
});
