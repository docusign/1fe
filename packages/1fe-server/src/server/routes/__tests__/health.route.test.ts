import express from 'express';
import request from 'supertest';

import { oneFEServer } from '../..';
import { serverOptions } from './server-options';
import { WidgetConfig, WidgetConfigs } from '../../types';
import { generateWidgetConfigMap } from '../../utils';
import { getCachedWidgetConfigs } from '../../utils/widget-config';

jest.mock('../../utils/widget-config', () => ({
  getCachedWidgetConfigs: jest.fn(),
}));

jest.mock('ky', () => ({
  get: jest.fn().mockReturnValue({}),
}));

jest.mock('../../utils/config-poller', () => ({
  pollDynamicConfig: jest.fn(),
}));

jest.mock('../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest.fn().mockImplementation(() => serverOptions),
}));

describe('Given Health endpoint to test', () => {
  let app: ReturnType<typeof express>;

  afterAll(async () => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    app = await oneFEServer(serverOptions);
  });

  const widgetConfigTestCases: {
    widgetConfigs: WidgetConfigs;
    expectedResponse: 'Healthy' | 'Not Healthy';
  }[] = [
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([]),
      expectedResponse: 'Not Healthy',
    },
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([
        // @ts-expect-error intentionally empty config
        {},
      ]),
      expectedResponse: 'Not Healthy',
    },
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([
        // @ts-expect-error intentionally missing runtime
        {
          widgetId: 'test',
          version: '1.0.0',
        },
      ]),
      expectedResponse: 'Not Healthy',
    },
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([
        {
          widgetId: 'test',
          version: '1.0.0',
          activePhasedDeployment: false,
          // @ts-expect-error intentionally wrong runtime type
          runtime: 'I should be an object',
        },
      ]),
      expectedResponse: 'Not Healthy',
    },
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([
        {
          widgetId: 'test',
          version: '1.0.0',
          activePhasedDeployment: false,
          // @ts-expect-error intentionally wrong runtime type
          runtime: 'I should be an object',
        },
      ]),
      expectedResponse: 'Not Healthy',
    },
    {
      widgetConfigs: generateWidgetConfigMap<WidgetConfig>([
        {
          widgetId: 'test',
          version: '1.0.0',
          runtime: {},
        },
      ]),
      expectedResponse: 'Healthy',
    },
  ];

  widgetConfigTestCases.forEach(({ expectedResponse, widgetConfigs }) => {
    it(`should return ${expectedResponse} when widget configs are ${
      expectedResponse === 'Healthy' ? 'valid' : 'invalid'
    }`, async () => {
      jest.mocked(getCachedWidgetConfigs).mockReturnValue(widgetConfigs);

      const response = await request(app).get('/health');

      expect(response.text).toBe(expectedResponse);
      expect(response.status).toBe(expectedResponse === 'Healthy' ? 200 : 500);
    });
  });
});
