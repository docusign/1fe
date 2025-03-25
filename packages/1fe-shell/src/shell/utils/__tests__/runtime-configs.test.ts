import { RUNTIME_CONFIG_OVERRIDES } from '../../constants/search-params';
import { clearRuntimeConfigOverrides } from '../runtime-configs';

describe('clearRuntimeConfigOverrides', () => {
  let originalLocation: Location;

  beforeAll(() => {
    originalLocation = window.location;
    delete (window as any).location;
    window.location = {
      href: 'https://example.com',
      toString: () => window.location.href,
    } as Location;
  });

  afterAll(() => {
    // Restore the original window.location object
    window.location = originalLocation;
  });

  it('should remove RUNTIME_CONFIG_OVERRIDES from the URL search parameters', () => {
    window.location.href = `https://example.com?${RUNTIME_CONFIG_OVERRIDES}=test`;

    clearRuntimeConfigOverrides();

    expect(window.location.href).toBe('https://example.com/');
  });

  it('should not alter the URL if RUNTIME_CONFIG_OVERRIDES is not present', () => {
    window.location.href = 'https://example.com/?otherParam=value';

    clearRuntimeConfigOverrides();

    expect(window.location.href).toBe('https://example.com/?otherParam=value');
  });

  it('should handle URLs with multiple search parameters and remove only RUNTIME_CONFIG_OVERRIDES', () => {
    window.location.href = `https://example.com/?param1=value1&${RUNTIME_CONFIG_OVERRIDES}=test&param2=value2`;

    clearRuntimeConfigOverrides();

    expect(window.location.href).toBe(
      'https://example.com/?param1=value1&param2=value2',
    );
  });
});
