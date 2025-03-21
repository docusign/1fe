import { basename, dirname, extname } from 'path';

export function getFileNameWithoutExtension(filePath: string) {
  return basename(filePath, extname(filePath));
}

export function getParentDirectoryName(filePath: string) {
  return basename(dirname(filePath));
}
