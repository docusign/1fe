// Based on https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';

// Until node 20 is used, it has { recursive: true }

/**
 * Recursively fetch file paths in directory
 * @param - dir Root directory to recurse
 * @returns Yields paths, e.g. ['file.txt', 'subdirectory1/file.txt']
 */
export async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}
