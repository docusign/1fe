import { Request } from 'express';
import { getParamFromQueryOrRedirectUri } from '../url';
import { STATE } from '../../constants';

describe('getParamFromQueryOrRedirectUri', () => {
  const mockReq = (query: Record<string, string>): Request =>
    ({ query }) as Request;

  const stateParamKey = 'someParam';
  const expectedStateValue = 'someValue';

  const stateParamValue = JSON.stringify({
    redirectUri: `/path/to/thing?${stateParamKey}=${expectedStateValue}`,
  });

  it('should return the query param value if present in req.query', () => {
    const req = mockReq({ [stateParamKey]: expectedStateValue });
    const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
    expect(result).toBe(expectedStateValue);
  });

  it('should return the query param value if present in state redirect URI', () => {
    const req = mockReq({ [STATE]: stateParamValue });
    const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
    expect(result).toBe(expectedStateValue);
  });

  it('root level param should have presidence over the one in state', () => {
    const req = mockReq({
      [STATE]: stateParamValue,
      [stateParamKey]: 'someOtherValue',
    });
    const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
    expect(result).toBe('someOtherValue');
  });

  it('should return null if the query param is not present', () => {
    const req = mockReq({});
    const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
    expect(result).toBeNull();
  });

  it('should return null if the state redirect URI is malformed', () => {
    const req = mockReq({ state: 'invalid JSON' });
    const result = getParamFromQueryOrRedirectUri(req, stateParamKey);
    expect(result).toBeNull();
  });
});
