import express from 'express';
import ky from 'ky';
import request from 'supertest';

import { Request, Response } from 'express';
import { ONEFE_ROUTES } from '../../constants';

import * as dataModule from '../../controllers/data';
import VersionController, {
  validateWidgetInputs,
} from '../../controllers/version.controller';
import { oneFEServer } from '../..';
import { serverOptions } from './server-options';
import { WidgetConfig } from '../../types';
import { getCachedWidgetConfigs } from '../../utils/widget-config';
import { generateWidgetConfigMap } from '../../utils';

jest.mock('ky', () => ({
  get: jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  }),
}));

jest.mock('../../utils/one-fe-configs', () => ({
  readOneFEConfigs: jest.fn().mockImplementation(() => serverOptions),
}));

jest.mock('../../utils/widget-config', () => ({
  getCachedWidgetConfigs: jest.fn(),
}));

jest.mock('../../utils/config-poller', () => ({
  pollDynamicConfig: jest.fn(),
}));

describe('Given Version Endpoint to test', () => {
  // to avoid redeclaring app and version route inside all tests in this block.
  let app: ReturnType<typeof express>;

  // before this describe block runs
  beforeAll(async () => {
    jest.mocked(ky.get).mockResolvedValue({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    } as any);

    jest.mocked(getCachedWidgetConfigs).mockReturnValue(
      generateWidgetConfigMap([
        {
          widgetId: '@1fe/widget-starter-kit',
          version: '1.4059.5',
          activePhasedDeployment: false,
        },
      ] as unknown as WidgetConfig[]),
    );

    app = await oneFEServer(serverOptions);
  });

  // after describe block ends.
  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('responds with status code 200', () => {
    return request(app)
      .get(ONEFE_ROUTES.VERSION)
      .then((response) => expect(response.statusCode).toBe(200));
  });

  it('returns a right node version', async () => {
    const response = await request(app).get(ONEFE_ROUTES.VERSION);
    expect(response.body.nodeVersion).toBe(process.version);
  });

  it('response returned matches expected value', async () => {
    const response = await request(app).get(ONEFE_ROUTES.VERSION);
    expect(response.body).toEqual(
      expect.objectContaining({
        version: expect.any(String),
        nodeVersion: expect.any(String),
        // buildNumber: expect.any(String),
        // gitSha: expect.any(String),
        // branch: expect.any(String),
        hashOfWidgetConfigs: expect.any(String),
      }),
    );
  });

  it('/version calls next if an error occurs', async () => {
    jest
      .spyOn(dataModule, 'dataForRenderingTemplate')
      .mockImplementationOnce(() => {
        throw new Error('test');
      });

    const mockNext = jest.fn();
    VersionController.index(
      {} as unknown as Request,
      {} as unknown as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('/widgetVersion returns 400 if no input data is passed', async () => {
    await request(app)
      .get('/version/foo/foo/foo')
      .then((res) => expect(res.statusCode).toBe(400));
  });

  it('/widgetVersion should call next on error', async () => {
    const error = new Error('test');
    const mockNext = jest.fn();
    await VersionController.widgetVersion(
      {} as unknown as Request,
      {
        status: () => {
          throw error;
        },
      } as unknown as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('/bundle returns 400 if no input data is passed', async () => {
    await request(app)
      .get('/version/foo/foo/foo/bundle')
      .then((res) => expect(res.statusCode).toBe(400));
  });

  it('/bundle should call next on error', async () => {
    const error = new Error('test');
    const mockNext = jest.fn();
    await VersionController.widgetBundle(
      {} as unknown as Request,
      {
        status: () => {
          throw error;
        },
      } as unknown as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('/badge should call next on error', async () => {
    const error = new Error('test');
    const mockNext = jest.fn();
    await VersionController.widgetBadge(
      {} as unknown as Request,
      {
        status: () => {
          throw error;
        },
      } as unknown as Response,
      mockNext,
    );
    expect(mockNext).toHaveBeenCalled();
  });

  // 90-92,96-97,127-128,151-152,155-159,162-166,181-185

  it('returns 500 if no data for rendering payload', async () => {
    jest
      .spyOn(dataModule, 'dataForRenderingTemplate')
      .mockResolvedValueOnce(undefined as any);
    const response = await request(app).get(`${ONEFE_ROUTES.VERSION}`);
    expect(response.status).toBe(500);
  });

  it('returns widget version', async () => {
    const response = await request(app).get(
      `${ONEFE_ROUTES.VERSION}/@1fe/widget-starter-kit/current`,
    );

    expect(response.body.version).toBe('1.4059.5');
    expect(response.status).toBe(200);
  });

  it('returns widget bundle', async () => {
    const response = await request(app).get(
      `${ONEFE_ROUTES.VERSION}/@1fe/widget-starter-kit/current/bundle`,
    );

    expect(
      response.headers.location.includes(
        '1fe/widgets/@1fe/widget-starter-kit/1.4059.5/js/1fe-bundle.js',
      ),
    ).toBe(true);
    expect(response.status).toBe(302);
  });

  it('returns widget contact', async () => {
    const response = await request(app).get(
      `${ONEFE_ROUTES.VERSION}/@1fe/widget-starter-kit/current`,
    );

    expect(response.body.contract).toBe(
      'https://docutest-a.akamaihd.net/production/1fe/widgets/@1fe/widget-starter-kit/1.4059.5/types/contract.rolledUp.d.ts',
    );
    expect(response.status).toBe(200);
  });
});

// describe('Get badge from version endpoint test', () => {
//   // to avoid redeclaring app and version route inside all tests in this block.
//   let app: ReturnType<typeof oneFEServer>;

//   // before this describe block runs
//   beforeAll(async () => {
//     jest.mocked(ky.get).mockReturnValueOnce({
//       json: () => Promise.resolve({}),
//       ok: true,
//       status: 200,
//     } as any);

//     app = oneFEServer(serverOptions);
//   });

//   // after describe block ends.
//   afterAll(async () => {
//     jest.clearAllMocks();
//   });

//   it('returns NA if missing widgetId supplied', async () => {
//     const response = await request(app).get(
//       `${ROUTES.VERSION}/org/widgetId/current/badge`,
//     );

//     expect(response.body.toString().includes('NA')).toBe(true);
//     expect(response.status).toBe(200);
//   });

//   it('returns a badge if the version param is current', async () => {
//     jest.mocked(ky.get).mockReturnValueOnce({
//       json: () => Promise.resolve({}),
//       ok: true,
//       status: 200,
//     } as any);

//     const response = await request(app).get(
//       `${ROUTES.VERSION}/@1fe/widget-starter-kit/current/badge`,
//     );

//     expect(response.status).toBe(200);
//     expect(response.body.toString().startsWith('<svg')).toBe(true);
//   });

//   it('returns a badge with the right values', async () => {
//     jest.mocked(ky.get).mockReturnValueOnce({
//       json: () => Promise.resolve({}),
//       ok: true,
//       status: 200,
//     } as any);

//     const response = await request(app).get(
//       `${ROUTES.VERSION}/@1fe/widget-starter-kit/current/badge`,
//     );

//     expect(response.status).toBe(200);
//     expect(response.body.toString().includes('1.4059.5')).toBe(true);
//     expect(response.body.toString().includes('PRODUCTION')).toBe(true);
//   });

//   it('returns an error if the version is not current', async () => {
//     jest.mocked(ky.get).mockReturnValueOnce({
//       json: () => Promise.resolve({}),
//       ok: true,
//       status: 200,
//     } as any);

//     const response = await request(app).get(
//       `${ROUTES.VERSION}/@1fe/widget-starter-kit/1.4059.5/badge`,
//     );

//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe(
//       "Badge is not available for version '1.4059.5'. Use 'current' for current version",
//     );
//     expect(response.text.startsWith('<svg')).toBe(false);
//   });

//   it('returns a badge with the correct response header', async () => {
//     jest.mocked(ky.get).mockReturnValueOnce({
//       json: () => Promise.resolve({}),
//       ok: true,
//       status: 200,
//     } as any);

//     const response = await request(app).get(
//       `${ROUTES.VERSION}/@1fe/widget-starter-kit/current/badge`,
//     );

//     expect(response.status).toBe(200);

//     // Check if the 'Content-Type' header is set correctly
//     expect(response.headers['content-type']).toEqual(
//       'image/svg+xml; charset=utf-8',
//     );
//   });
// });

describe('validateWidgetInputs', () => {
  it('should handle missing org', async () => {
    const result = await validateWidgetInputs({
      params: { widgetId: 'test', version: 555 },
    } as unknown as Request);

    expect(result).toEqual({
      data: undefined,
      error: `Missing org, example: '@1fe'`,
    });
  });

  it('should handle missing widgetId', async () => {
    const result = await validateWidgetInputs({
      params: { org: '@ds', version: 555 },
    } as unknown as Request);

    expect(result).toEqual({
      data: undefined,
      error: `Missing widgetId, example: 'widget-starter-kit'`,
    });
  });

  it('should handle missing org', async () => {
    const result = await validateWidgetInputs({
      params: { org: '@ds', widgetId: 'test' },
    } as unknown as Request);

    expect(result).toEqual({
      data: undefined,
      error: `Missing version, use 'current' for current version`,
    });
  });

  it('should version !== "current"', async () => {
    jest.mocked(getCachedWidgetConfigs).mockReturnValue(
      generateWidgetConfigMap([
        {
          widgetId: '@ds/test',
          version: '1.4059.5',
          activePhasedDeployment: false,
        },
      ] as unknown as WidgetConfig[]),
    );

    const result = await validateWidgetInputs({
      params: { org: '@ds', widgetId: 'test', version: 'not-current' },
    } as unknown as Request);

    expect(result).toEqual({
      data: undefined,
      error: `API only supports 'current' version. Please use 'current' version or construct your own versioned cdn url`,
    });
  });
});
