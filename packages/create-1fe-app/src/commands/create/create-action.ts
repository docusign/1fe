import { join } from 'path';

import { getLogger } from '../../lib/getLogger';
import { getGitCloneUrl } from '../../lib/git-utils';
import { CreateCommandArgs, CreateCommandOptions } from './create-command';
import { existsSync, rmSync } from 'fs';
import { gitCloneAsync } from './gitCloneAsync';

export async function createAction(
  appName: CreateCommandArgs[0],
  { gitProtocol, debug, trace }: CreateCommandOptions,
) {
  const logger = getLogger('[create-1fe]', debug, trace);
  logger.log('⚒️ Welcome to the 1fe app creator! ⚒️');

  const cloneUrl = getGitCloneUrl(gitProtocol);
  const clonePath = join(process.cwd(), appName);

  try {
    logger.info('🔗 Cloning repository from:', cloneUrl);
    const response = await gitCloneAsync(cloneUrl, clonePath);
    logger.debug('Clone response:', response);
  } catch (error) {
    logger.error('🛑 Failed to clone the repository:', error);
    throw new Error(
      'Failed to clone the repository. Please check the URL or your network connection.',
    );
  }

  logger.info(`✅ Repository cloned successfully at ${clonePath}`);

  logger.info('⚠️ Removing git history from the cloned repo');

  const dotGitDir = join(clonePath, '.git');

  if (existsSync(dotGitDir)) {
    rmSync(join(clonePath, '.git'), {
      recursive: true,
    });
    logger.info('✅ Git history removed successfully');
  } else {
    logger.warn('No .git directory found, skipping git history removal');
  }

  logger.log(
    '🎉 Your 1fe app has been created successfully! 🎉',
    `\n\nTo get started, navigate to the app directory:\n\n  cd ${appName}\n\n`,
    'Then, install the dependencies:\n\n  yarn\n\n',
    'Finally, start the development server:\n\n  yarn dev\n\n',
    'Then navigate to http://localhost:3001 in your browser to see your new 1fe app in action!\n\n',
    'Happy coding! 🚀\n',
  );
}
