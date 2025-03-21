import type { load } from 'ts-import';

/**
 * ts-import has gone `esm` but it still has a few issues with how it imports certain dependencies.
 * This function is a workaround for that - essentially avoiding a top level await within ts-import.
 * TODO: Create a eslint rule to disallow using ts-import in any other file but this.
 */
export async function loadTsDefault(...args: Parameters<typeof load>) {
  return (await import('ts-import')).load(...args).then((m) => m.default);
}
