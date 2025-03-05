import { shallowEqual } from 'react-redux';
import { createSelectorCreator, defaultMemoize } from 'reselect';

export const createShallowSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual,
);

/**
 * Validate the props string to be a valid JavaScript
 * @param {string} jsCode
 * @returns {boolean} true if the props are valid, false otherwise
 */
export const propsValidation = (jsCode: string): boolean => {
  try {
    // This is dangerous, but the only way to validate what is in the editor can be consumed as an object.
    const jsObject = eval('(' + jsCode + ')');
    if (typeof jsObject !== 'object') {
      throw new Error('You must pass an object');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export function isNotNullable<T>(value: T | undefined | null): value is T {
  return value !== null;
}
