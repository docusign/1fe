import { GITHUB_DOMAIN, GITHUB_REPO } from './constants';

export function getGitCloneUrl(type: 'https' | 'ssh') {
  if (type === 'https') {
    return `https://${GITHUB_DOMAIN}/${GITHUB_REPO}.git`;
  } else if (type === 'ssh') {
    return `git@${GITHUB_DOMAIN}:${GITHUB_REPO}.git`;
  } else {
    throw new Error('Invalid type specified. Use "https" or "git".');
  }
}
