import store from 'store2';

// import { getShellLogger } from '../../../utils/telemetry';

import type { AllowedTypes } from './types';

export type { AllowedTypes } from './types';

export type SessionStoragePlatformUtils = {
  set: (key: string, value: AllowedTypes) => void;
  get: <T extends AllowedTypes>(key: string) => T;
  getAll: <T extends AllowedTypes>() => Record<string, T>;
  clear: () => void;
  remove: (key: string) => void;
  size: () => number | undefined;
};

console.log(store);

export const initSessionStorage = (widgetId: string) => {
  // const logger = getShellLogger(widgetId);

  if (!widgetId) {
    const errorMessage = 'Invalid widget Id passed to session Storage util';
    // logger.error({
    //   message: `${errorMessage}`,
    //   category: 'utils.storage.sessionStorage',
    // });
    throw new Error(errorMessage);
  }
  console.log({
    store,
    session: store.session,
    windowStore: (window as any).store,
    windowStore2: (window as any).store2
  });

  const namespace = store.namespace(widgetId);

  const set = (key: string, value: AllowedTypes): void => {
    try {
      // TODO: Add zod runtime validation in order to support objects
      if (!['string', 'boolean', 'number'].includes(typeof value)) {
        const errMessage = `the type of following value : ${value} is ${typeof value}, it is not supported by this util`;
        // logger.error({
        //   message: errMessage,
        //   category: 'utils.storage.sessionStorage',
        // });
        throw new Error(errMessage);
      }
      namespace.session(key, value);
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage set of key: ${key}, ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const get = <T extends AllowedTypes>(key: string): T => {
    try {
      return namespace.session.get(key) as T;
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage get: ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const getAll = <T extends AllowedTypes>(): Record<string, T> => {
    try {
      return namespace.session.getAll();
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage getAll: ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const clear = (): void => {
    try {
      namespace.session.clear();
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage clear: ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const remove = (key: string): void => {
    try {
      namespace.session.remove(key);
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage remove key: ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const size = (): number | undefined => {
    try {
      return namespace.session.size();
    } catch (e) {
      const errMessage = `exception occured in widget ${namespace} during session storage get size: ${e}`;
      // logger.error({
      //   message: errMessage,
      //   category: 'utils.storage.sessionStorage',
      // });
      throw new Error(errMessage);
    }
  };

  const sessionStorageFunctions = {
    set,
    get,
    getAll,
    clear,
    remove,
    size,
  } as const;

  return 'temp';

  // return sessionStorageFunctions;
};
