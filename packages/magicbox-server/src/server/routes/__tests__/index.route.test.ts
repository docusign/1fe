import ky from 'ky';
import request from 'supertest';

import { magicBoxServer } from '../..';
import { serverOptions } from './server-options';

jest.mock('ky', () => ({
  get: jest.fn().mockReturnValue({}),
}));

jest.mock('../../utils/config-poller', () => ({
  pollDynamicConfig: jest.fn(),
}));

jest.mock('../../utils/magicbox-configs', () => ({
  readMagicBoxConfigs: jest.fn().mockImplementation(() => (serverOptions)),
}));

describe('Testing Index', () => {
  let app: ReturnType<typeof magicBoxServer>;

  afterAll(async () => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    jest.mocked(ky.get).mockReturnValueOnce({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    } as any);

    app = magicBoxServer(serverOptions);
  });

  describe('[GET] /', () => {
    it('response statusCode 200', async () => {
      const response = await request(app).get(`/`);

      expect(response.status).toBe(200);
    });
  });
});
