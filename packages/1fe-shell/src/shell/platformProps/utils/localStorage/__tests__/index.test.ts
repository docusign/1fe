import store from 'store2';

import { initLocalStorage } from '..';

jest.mock('../../../../configs/shell-configs', () => ({
  readOneFEShellConfigs: jest.fn().mockReturnValue({
    shellLogger: {
      log: jest.fn(),
      error: jest.fn()
    }
  }),
}));

describe('localStorage', () => {
  const widgetId = 'myWidget';
  const key = 'testKey';
  const value = 'testValue';
  const key2 = 'testBooleanKey';
  const booleanValue = true;
  const key3 = 'testNumber';
  const numberValue = 1;

  beforeEach(() => {
    store.clearAll(); // Clear the store2 data before each test here
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const localStorage = initLocalStorage(widgetId);

  it('should set a value in localStorage', () => {
    localStorage.set(key, value);
    expect(localStorage.get(key)).toEqual(value);
  });

  it('should throw an error for an empty widgetId', () => {
    const emptyWidgetId = '';
    expect(() => {
      initLocalStorage(emptyWidgetId);
    }).toThrow('Invalid widget Id passed to local storage util');
  });

  it('should set and get a  string value in localStorage', () => {
    localStorage.set(key, value);
    expect(localStorage.get(key)).toEqual(value);
  });

  it('should set and get a boolean value in localStorage', () => {
    localStorage.set(key2, booleanValue);
    expect(localStorage.get(key2)).toEqual(booleanValue);
  });

  it('should set and get a value  of type number in localStorage', () => {
    localStorage.set(key3, numberValue);
    expect(localStorage.get(key3)).toEqual(numberValue);
  });

  it('should getAll key value in localStorage, and all keys in localstorage', () => {
    localStorage.set(key, value);
    localStorage.set(key2, booleanValue);
    expect(localStorage.getAll()).toEqual({
      testBooleanKey: true,
      testKey: 'testValue',
    });
    expect(localStorage.keys()).toEqual([key, key2]);
  });

  it('should return correct size when keys are set, and clear all keys & values in localStorage when clear is invoked', () => {
    localStorage.set(key, value);
    localStorage.set(key2, booleanValue);
    expect(localStorage.size()).toEqual(2);
    localStorage.clear();
    expect(localStorage.size()).toEqual(0);
  });

  it('should remove a specific key', () => {
    localStorage.set(key, value);
    localStorage.remove(key);
    expect(localStorage.get(key)).toEqual(null);
  });

  it('should handle exceptions when setting a value', () => {
    jest.spyOn(store.namespace(widgetId), 'local').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.set(key, value);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when getting a value', () => {
    jest.spyOn(store.namespace(widgetId), 'get').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.get(key);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when getting all values', () => {
    jest.spyOn(store.namespace(widgetId), 'getAll').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.getAll();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when clearing', () => {
    jest.spyOn(store.namespace(widgetId), 'clear').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.clear();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when removing', () => {
    jest.spyOn(store.namespace(widgetId), 'remove').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.remove(key);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions for size', () => {
    jest.spyOn(store.namespace(widgetId), 'size').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.size();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions for keys', () => {
    jest.spyOn(store.namespace(widgetId), 'keys').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => {
      localStorage.keys();
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle exceptions when setting type that is not supported', () => {
    expect(() => {
      localStorage.set(key, (() => {}) as unknown as string);
    }).toThrow();

    // expect(mockLogger.error).toHaveBeenCalled();
  });
});
