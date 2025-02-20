import { Request } from 'express';
import { getParamFromQueryOrRedirectUri } from '../url';
import { getCachedWidgetConfigs } from '../widget-config';
import { getRuntimeCSPConfigs } from '../csp';

jest.mock('../widget-config', () => ({
  getCachedWidgetConfigs: jest.fn(),
}));

jest.mock('../url', () => ({
  getParamFromQueryOrRedirectUri: jest.fn(),
}));

describe('getRuntimeCSPConfigs', () => {
  const mockReq = {
    /* mock request object as needed */
  } as Request;
  const pluginId = 'testPlugin';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return overrided configs', () => {
    const runtimeConfigOverrides = JSON.stringify({
      testPlugin: {
        headers: {
          csp: {
            enforced: "default-src 'self' enforced.com",
            reportOnly: "default-src 'self' reportOnly.com",
          },
        },
      },
    });

    jest
      .mocked(getParamFromQueryOrRedirectUri)
      .mockReturnValue(runtimeConfigOverrides);
    jest.mocked(getCachedWidgetConfigs as any).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const reportOnly = getRuntimeCSPConfigs({
      pluginId,
      reportOnly: true,
      req: mockReq,
    });
    const enforced = getRuntimeCSPConfigs({
      pluginId,
      reportOnly: false,
      req: mockReq,
    });
    expect(enforced).toBe("default-src 'self' enforced.com");
    expect(reportOnly).toBe("default-src 'self' reportOnly.com");
  });

  it('should return cached widget config runtime csp if no override given', () => {
    const runtimeConfigOverrides = {
      runtime: {
        headers: {
          csp: {
            enforced: "default-src 'self' enforced.com not-overrided.com",
            reportOnly: "default-src 'self' reportOnly.com not-overrided.com",
          },
        },
      },
    };

    jest.mocked(getParamFromQueryOrRedirectUri).mockReturnValue(null);
    jest.mocked(getCachedWidgetConfigs as any).mockReturnValue({
      get: jest.fn().mockReturnValue(runtimeConfigOverrides),
    });

    const reportOnly = getRuntimeCSPConfigs({
      pluginId,
      reportOnly: true,
      req: mockReq,
    });
    const enforced = getRuntimeCSPConfigs({
      pluginId,
      reportOnly: false,
      req: mockReq,
    });
    expect(enforced).toBe("default-src 'self' enforced.com not-overrided.com");
    expect(reportOnly).toBe(
      "default-src 'self' reportOnly.com not-overrided.com",
    );
  });
});
