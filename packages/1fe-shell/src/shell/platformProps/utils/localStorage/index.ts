import store from 'store2';

import { getShellLogger } from '../../../utils/telemetry';
import { AllowedTypes } from '../sessionStorage/types';

export type LocalStoragePlatformUtils = {
  set: (key: string, value: AllowedTypes) => void;
  get: <T extends AllowedTypes>(key: string) => T;
  getAll: <T extends AllowedTypes>() => Record<string, T>;
  clear: () => void;
  remove: (key: string) => void;
  size: () => number | undefined;
  keys: () => string[];
};

export const initLocalStorage = (widgetId: string) => {
  const logger = getShellLogger();

  if (!widgetId) {
    const errorMessage = 'Invalid widget Id passed to local storage util';
    logger.error({
      message: `${errorMessage}`,
      category: 'utils.storage.localStorage',
      widgetId
    });
    throw new Error(errorMessage);
  }
  const namespace = store.namespace(widgetId);

  const set = (key: string, value: AllowedTypes): void => {
    try {
      // TODO: Add zod runtime validation in order to support objects
      if (
        !['string', 'boolean', 'number', 'undefined'].includes(typeof value)
      ) {
        const errMessage = `"the type of following value : ${value} is ${typeof value}, it is not supported by this util"`;
        logger.error({
          message: errMessage,
          category: 'utils.storage.localStorage',
          widgetId
        });
        throw new Error(errMessage);
      }
      namespace.local(key, value);
    } catch (e) {
      const errorMessage = `"${e} occured in widget ${namespace} during local storage set of key: ${key} value: ${value}"`;
      logger.error({
        message: errorMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errorMessage);
    }
  };

  const get = <T extends AllowedTypes>(key: string): T => {
    try {
      return namespace.get(key);
    } catch (e) {
      const errMessage = `"exception: ${e} occured in widget ${namespace} during local storage get key: ${key}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  const getAll = <T extends AllowedTypes>(): Record<string, T> => {
    try {
      return namespace.getAll();
    } catch (e) {
      const errMessage = `"exception occured in widget ${namespace} during local storage getAll: ${e}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  const clear = (): void => {
    try {
      namespace.clear();
    } catch (e) {
      const errMessage = `"exception occured in widget ${namespace} during local storage clear: ${e}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  const remove = (key: string): void => {
    try {
      namespace.remove(key);
    } catch (e) {
      const errMessage = `"exception occured in widget ${namespace} during local storage remove key: ${e}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  const size = (): number | undefined => {
    try {
      return namespace.size();
    } catch (e) {
      const errMessage = `"exception occured in widget ${namespace} during local storage get size: ${e}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  const keys = (): string[] => {
    try {
      return namespace.keys();
    } catch (e) {
      const errMessage = `"exception occured in widget ${namespace} during local storage get array of keys: ${e}"`;
      logger.error({
        message: errMessage,
        category: 'utils.storage.localStorage',
        widgetId
      });
      throw new Error(errMessage);
    }
  };

  // TODO add .on that notifies when localStorage changes
  const localStorageFunctions = {
    set,
    get,
    getAll,
    clear,
    remove,
    size,
    keys,
  } as const;

  return localStorageFunctions;
};
