import { memoize } from 'lodash';
import { getKnownPaths } from './paths/getKnownPaths';
import { PackageJson } from 'type-fest';

export const getWidgetPackageJson = memoize(async () => {
  return (await import(getKnownPaths().packageJson)) as PackageJson;
});
