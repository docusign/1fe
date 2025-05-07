import {
  getDynamicExternalLibraryConfigs,
  getDynamicInstalledLibraryConfigs,
} from '../../utils/libs';
import { Lib } from './types';
// TODO[1fe][post-mvp]: What do we do about this? Does this need to be supported in 1FE?
export const getInstalledLibVersions = (): Lib[] => {
  const optimizelyData = getDynamicInstalledLibraryConfigs();

  // const packageJsonLibs = Object.keys(
  //   PACKAGE_JSON_INSTALLED_LIBS_TO_MONITOR_ENUM,
  // )
  //   .map((libId) => {
  //     const libPackageJson = require(`${libId}/package.json`);
  //     return { id: libId, version: libPackageJson.version };
  //   })
  //   .concat(
  //     // also monitor @1ds/shell (1ds-app repo)
  //     {
  //       id: APP_NAME,
  //       version: SERVER_VERSION,
  //     },
  //   );

  // const liveVersionLibs = Object.keys(
  //   LIVE_VERSION_INSTALLED_LIBS_TO_MONITOR_ENUM,
  // ).map((libId) => {
  //   const libVersion = optimizelyData.find((lib) => lib.id === libId);

  //   if (libVersion?.version) {
  //     return {
  //       id: libId,
  //       version: libVersion?.version,
  //     };
  //   }

  //   // We will roll out any change by environment, so still need to fallback to package.json
  //   const libPackageJson = require(`${libId}/package.json`);
  //   return { id: libId, version: libPackageJson.version };
  // });

  // return [...packageJsonLibs, ...liveVersionLibs];

  const liveVersionLibs = optimizelyData.map((lib) => {
    if (lib?.version) {
      return {
        id: lib.id,
        version: lib?.version,
      };
    }

    // We will roll out any change by environment, so still need to fallback to package.json

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const libPackageJson = require(`${lib.id}/package.json`);
    return { id: lib.id, version: libPackageJson.version };
  });

  return [...liveVersionLibs];
};

export const getLivePackageVersions = (): {
  externals: (Lib & { name: string })[];
  installed: Lib[];
} => {
  const externals = getDynamicExternalLibraryConfigs().map(
    ({ id, version, name }) => ({
      id,
      version,
      name,
    }),
  );

  const installed = getInstalledLibVersions();

  return {
    externals,
    installed,
  };
};
