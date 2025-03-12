// mock must be placed before import
// for jest to respect the mock
const mockLogger = { error: jest.fn() };

import store from 'store2';

import { initSessionStorage } from '..';

jest.mock('../../../../utils/telemetry', () => ({
  getShellLogger: jest.fn(() => mockLogger),
}));

describe('sessionStorage', () => {
  const widgetId = 'myWidget';
  const key = 'testKey';
  const value = 'testValue';
  const key2 = 'testBooleanKey';
  const booleanValue = true;
  const key3 = 'testNumber';
  const numberValue = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    store.clearAll(); // Clear the store2 data before each test
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const sessionStorage = initSessionStorage(widgetId);

  it('should set a value in sessionStorage', () => {
    sessionStorage.set(key, value);
    expect(sessionStorage.get(key)).toEqual(value);
  });

  it('should throw an error for an empty widgetId', () => {
    const emptyWidgetId = '';
    expect(() => {
      initSessionStorage(emptyWidgetId);
    }).toThrow('Invalid widget Id passed to session Storage util');
  });

  it('should get a value in sessionStorage', () => {
    sessionStorage.set(key, value);
    expect(sessionStorage.get(key)).toEqual(value);
  });

  it('should set and get a value of type boolean in sessionStorage', () => {
    sessionStorage.set(key2, booleanValue);
    expect(sessionStorage.get(key2)).toEqual(booleanValue);
  });

  it('should set and get a value  of type number in sessionStorage', () => {
    sessionStorage.set(key3, numberValue);
    expect(sessionStorage.get(key3)).toEqual(numberValue);
  });

  it('should getAll key value in sessionStorage', () => {
    sessionStorage.set(key, value);
    sessionStorage.set(key2, booleanValue);
    expect(sessionStorage.getAll()).toEqual({
      testBooleanKey: true,
      testKey: 'testValue',
    });
  });

  it('should return correct size when keys are set, and clear all keys & values in sessionStorage when clear is invoked', () => {
    sessionStorage.set(key, value);
    sessionStorage.set(key2, booleanValue);
    expect(sessionStorage.size()).toEqual(2);
    sessionStorage.clear();
    expect(sessionStorage.size()).toEqual(0);
  });

  it('should remove a specific key', () => {
    sessionStorage.set(key, value);
    sessionStorage.remove(key);
    expect(sessionStorage.get(key)).toEqual(null);
  });

  it('should handle exceptions when setting a value', () => {
    jest.spyOn(store.namespace(widgetId), 'session').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      sessionStorage.set(key, value);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when etting a value of the wrong type', () => {
    jest.spyOn(store.namespace(widgetId), 'session').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.set(key, (() => {}) as unknown as string);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when getting a value', () => {
    jest.spyOn(store.namespace(widgetId), 'session').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.get(key);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when getting all values', () => {
    jest.spyOn(store.namespace(widgetId), 'getAll').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.getAll();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when clearing', () => {
    jest.spyOn(store.namespace(widgetId), 'clear').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.clear();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when removing', () => {
    jest.spyOn(store.namespace(widgetId), 'remove').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.remove(key);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when getting size', () => {
    jest.spyOn(store.namespace(widgetId), 'size').mockImplementation(() => {
      throw new Error('Storage error');
    });
    expect(() => {
      sessionStorage.size();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });
});
