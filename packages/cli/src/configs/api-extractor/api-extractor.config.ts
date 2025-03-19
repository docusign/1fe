import { IConfigFile } from '@microsoft/api-extractor';

export const apiExtractorConfig: IConfigFile = {
  mainEntryPointFilePath: '<projectFolder>/dist/widget.d.ts',
  bundledPackages: [],
  compiler: {
    tsconfigFilePath: '<projectFolder>/tsconfig.json',
  },
  apiReport: {
    enabled: false,
    reportFileName: '<unscopedPackageName>.api.md',
    reportFolder: '<projectFolder>/api/',
    reportTempFolder: '<projectFolder>/api/temp',
    includeForgottenExports: true,
  },
  docModel: {
    enabled: false,
  },
  dtsRollup: {
    enabled: true,
    untrimmedFilePath: '<projectFolder>/dist/types/contract.rolledUp.d.ts',
  },
  tsdocMetadata: {
    enabled: false,
  },
  messages: {},
};
