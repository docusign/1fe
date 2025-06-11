import simpleGit from 'simple-git';

export function gitCloneAsync(cloneUrl: string, clonePath: string) {
  return new Promise<void>((resolve, reject) => {
    const git = simpleGit();

    git.clone(
      cloneUrl,
      clonePath,
      ['--depth', '1', '--single-branch'],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}
