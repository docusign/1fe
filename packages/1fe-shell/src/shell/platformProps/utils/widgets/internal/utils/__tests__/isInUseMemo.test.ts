import { getBrowserEnvironment } from '../../../../../../utils/env.helpers';
import { isInUseMemo } from '../isInUseMemo';

jest.mock('../../../../../../utils/env.helpers', () => ({
  getBrowserEnvironment: jest.fn(() => ({
    browser: {
      name: 'Chrome',
    },
  })),
}));

describe('Testing isInUseMemo', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // reset global.Error
    global.Error = jest.fn() as any;

    global.Error = jest.fn(() => ({
      stack: '',
    })) as any;
  });

  it('should return false when function is not called from inside a useMemo', () => {
    global.Error = jest.fn(() => ({
      stack:
        'definitelyNotMemo@https://docucdn-a.akamaihd.net/production/1ds/libs/react-dom/17.0.2/umd/react-dom.production.min.js:109:151',
    })) as any;
    expect(isInUseMemo()).toBe(false);
  });

  it('should return true when function is called from inside a useMemo', () => {
    function useMemo() {
      return isInUseMemo();
    }

    expect(useMemo()).toBe(true);
  });

  it('should check for Safari and Firefox when function is called from inside a useMemo', () => {
    jest.mocked(getBrowserEnvironment).mockImplementation(() => ({
      browser: {
        name: 'Safari',
      },
      os: {
        name: 'iOS',
      },
      engine: {
        name: 'WebKit',
      },
      platform: {
        type: 'mobile',
      },
    }));

    global.Error = jest.fn(() => ({
      stack:
        'wh@https://docucdn-a.akamaihd.net/production/1ds/libs/react-dom/17.0.2/umd/react-dom.production.min.js:109:151',
    })) as any;

    function minifiedMemoInProd() {
      return isInUseMemo();
    }

    expect(minifiedMemoInProd()).toBe(true);
  });
});
