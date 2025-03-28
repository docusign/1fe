import type { LiveVersions } from '../../types/version';

export const mockLiveVersions: LiveVersions = {
  configs: {
    widgetConfig: [],
    pluginConfig: [],
  },
  environment: 'development',
  version: '',
  nodeVersion: '',
  buildNumber: '',
  branch: '',
  gitSha: '',
  packages: {
    installed: [],
    externals: [],
  },
};

export const fetchLiveVersions = jest.fn().mockResolvedValue(mockLiveVersions);
