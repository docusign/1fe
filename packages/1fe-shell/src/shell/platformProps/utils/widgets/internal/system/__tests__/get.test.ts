// import {
//   HOSTED_ENVIRONMENTS,
//   getWidgetBundleCdnUrl,
// } from '@1fe/helpers/isomorphic';
// import { shellConsoleLogger } from '@1fe/helpers/client';

import { get } from '../get';
import { isSystemEnv } from '../../utils/isSystem';
import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../../../1fe-server/src/server/utils/widget-config-helpers';
// import { WidgetConfig } from '../../../../../../types/widget-config';
import { getWidgetBundleCdnUrl } from '../../../../../../utils/url';
import { WidgetConfig } from '../../../../../../../../../1fe-server/src/server/types';
// import { getEnvironmentConfigs } from '../../../../../../utils/env-helpers';
// import { EnvConfig } from '../../../../../../../types';
// import { getRequestedWidgetConfigWithoutRuntimeConfig } from '../../../../../../../isomorphic/widgetConfigs/getWidgetConfigs';
// import { WidgetConfig } from '../../../../../../../isomorphic/types/widgetConfigs.types';

// jest.mock('../../../../../../utils/env-helpers', () => ({
//   getEnvironmentConfigs: jest.fn(),
// }));

// jest.mock(
//   '../../../../../../../isomorphic/widgetConfigs/getWidgetConfigs',
//   () => ({
//     getRequestedWidgetConfigWithoutRuntimeConfig: jest.fn(),
//   }),
// );

jest.mock('../../../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({}),
}));

jest.mock<
  typeof import('../../../../../../../../../1fe-server/src/server/utils/widget-config-helpers')
>(
  '../../../../../../../../../1fe-server/src/server/utils/widget-config-helpers',
  () => ({
    ...jest.requireActual(
      '../../../../../../../../../1fe-server/src/server/utils/widget-config-helpers',
    ),
    getRequestedWidgetConfigWithoutRuntimeConfig: jest.fn(),
  }),
);

// const mockShellLogger = jest.fn();
// const mockShellError = jest.fn();

// jest.mock('../../../../../../utils/telemetry', () => ({
//   getShellLogger: () => {
//     return {
//       log: mockShellLogger,
//       error: mockShellError,
//     };
//   },
// }));

jest.mock('../../utils/isSystem', () => ({
  isSystemEnv: jest.fn(),
}));
// jest.mock('../../../../logPlatformUtilUsage', () => ({
//   logPlatformUtilUsage: jest.fn(),
// }));

jest.mock('../../../../../../utils/url', () => ({
  ...jest.requireActual('../../../../../../utils/url'),
  getWidgetBundleCdnUrl: jest.fn(),
}));

jest.mock('../../../../../context/getWidgetPath');

// jest.mock('@1fe/helpers/isomorphic', () => ({
//   ...jest.requireActual('@1fe/helpers/isomorphic'),
//   getWidgetBundleCdnUrl: jest.fn(),
// }));

const cdnUrl = 'cdnUrl';
const hostWidgetId = 'hostWidgetId';

const normalRequestedWidgetConfig: WidgetConfig = {
  version: '1.0.0',
  widgetId: 'normalWidget',
  runtime: {},
};

const pinnedRequestedWidgetConfig: WidgetConfig = {
  version: '1.0.0',
  widgetId: 'pinnedWidget',
  runtime: {},
  type: 'pinned',
};

const mockModule = { default: { foo: 'bar' } };
const _System = {
  import: jest.fn(),
} as unknown as typeof System;

beforeEach(() => {
  jest.resetAllMocks();

  jest.mocked(isSystemEnv).mockReturnValue(true);
  jest.mocked(getWidgetBundleCdnUrl).mockReturnValue(cdnUrl);
  // jest.mocked(getEnvironmentConfigs).mockReturnValue({
  //   ENVIRONMENT: 'integration',
  // } as EnvConfig);
  jest.mocked(_System.import).mockResolvedValue(mockModule);
});

it('should throw an error when no widget ID provided', async () => {
  await expect(get(_System, hostWidgetId)('')).rejects.toThrowError(
    '[platformProps.utils.widgets.get] No widget ID provided, please refer to API documentation: https://github.docusignhq.com/pages/Core/1fe-docs/widgets/utils/widgets/#get',
  );
});

it('should throw an error when Systemjs is not detected', async () => {
  jest.mocked(isSystemEnv).mockReturnValue(false);

  await expect(
    get(_System, hostWidgetId)(normalRequestedWidgetConfig.widgetId),
  ).rejects.toThrowError(
    '[platformProps.utils.widgets.get] Systemjs not detected. Something is critically wrong. Please reach out to 1FE team.',
  );
});

it('should get a normal requestedWidget from the CDN', async () => {
  jest.mocked(getRequestedWidgetConfigWithoutRuntimeConfig).mockReturnValue({
    requestedWidgetConfig: normalRequestedWidgetConfig,
  });

  const result = await get(
    _System,
    hostWidgetId,
  )(normalRequestedWidgetConfig.widgetId);

  expect(result).toEqual(mockModule);
  // expect(shellConsoleLogger.warn).not.toHaveBeenCalled();
  expect(_System.import).toHaveBeenCalledWith(
    normalRequestedWidgetConfig.widgetId,
  );
});

it('should get a pinned widget from the CDN with the specified version', async () => {
  const version = '1.1.0';

  jest.mocked(getRequestedWidgetConfigWithoutRuntimeConfig).mockReturnValue({
    requestedWidgetConfig: { ...pinnedRequestedWidgetConfig, version },
    type: 'pinned',
  });

  const result = await get(
    _System,
    hostWidgetId,
  )(normalRequestedWidgetConfig.widgetId);

  expect(result).toEqual(mockModule);
  expect(getWidgetBundleCdnUrl).toHaveBeenCalledWith({
    widgetId: normalRequestedWidgetConfig.widgetId,
    version,
  });
  expect(_System.import).toHaveBeenCalledWith(cdnUrl);
});

it('should throw an error if getting the widget by ID fails', async () => {
  jest.mocked(_System.import).mockRejectedValue(new Error('Widget not found'));

  await expect(
    get(_System, hostWidgetId)(normalRequestedWidgetConfig.widgetId),
  ).rejects.toThrowError(
    '[platformProps.utils.widgets.get] Getting widget by ID failed.',
  );
});
