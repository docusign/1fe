import { isEqual as _isEqual, cloneDeep, isEmpty } from 'lodash';
import { IMPORT_MAP_OVERRIDE_LIB_NEXT, SYSTEM_LOADER } from '../constants';
import { ExternalLibConfig, InstalledLibConfig } from '../types';
import { readMagicBoxConfigs } from './config-poller';

// TODO: replace this w/ config file
const IS_PROD = true;

let libraryConfigs: (ExternalLibConfig | InstalledLibConfig)[] = [];
export const getLibraryConfigs = (): (
  | ExternalLibConfig
  | InstalledLibConfig
)[] => {
  return libraryConfigs;
};

export const setLibraryConfigs = (
  newLibraryConfigs: (ExternalLibConfig | InstalledLibConfig)[],
) => {
  libraryConfigs = newLibraryConfigs;
};

const getDynamicExternalLibraryConfigs = (): ExternalLibConfig[] => {
  const libIsExternal = (
    lib: ExternalLibConfig | InstalledLibConfig,
  ): lib is ExternalLibConfig => lib.type === 'external';

  return getLibraryConfigs().filter(libIsExternal);
};

const getCDNLibraryUrl = (id: string, version: string, path: string): string => {
  const libBaseUrl = readMagicBoxConfigs().dynamicConfigs.cdn.libraries.basePrefix;
  return `${libBaseUrl}${id}/${version}/${path}`;
}

const getExternalLibsWithUrl = ({
  getPreloaded,
}: {
  getPreloaded: boolean;
}): Record<string, string> => {
  // dynamic libraryConfig from Optimizely + Akamai CDN
  const dynamicLibraryConfig = getDynamicExternalLibraryConfigs().reduce(
    (itr, libraryConfig) => {
      const { path, isPreloaded, id, name, version } = libraryConfig;

      if ((getPreloaded && isPreloaded) || (!getPreloaded && !isPreloaded)) {
        return {
          ...itr,
          [name]: getCDNLibraryUrl(id, version, path),
        };
      }

      return itr;
    },
    {},
  );

  return dynamicLibraryConfig;
};

export const getPreloadedLibs = () =>
  getExternalLibsWithUrl({ getPreloaded: true });

export const getLazyLoadedLibs = () =>
  getExternalLibsWithUrl({ getPreloaded: false });

export const getCriticalLibs = () => ({
  System: getCDNLibraryUrl(
    SYSTEM_LOADER.id,
    SYSTEM_LOADER.version,
    IS_PROD ? 'dist/system.min.js' : 'dist/system.js',
  ),
  SystemAMD: getCDNLibraryUrl(
    SYSTEM_LOADER.id,
    SYSTEM_LOADER.version,
    IS_PROD ? 'dist/extras/amd.min.js' : 'dist/extras/amd.js',
  ),
  ImportMapOverride: getCDNLibraryUrl(
    IMPORT_MAP_OVERRIDE_LIB_NEXT.id,
    IMPORT_MAP_OVERRIDE_LIB_NEXT.version,
    IS_PROD
      ? 'dist/import-map-overrides-api.js'
      : 'dist/import-map-overrides.js',
  ),
});
