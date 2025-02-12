import { shallowEqual } from 'react-redux';
import { createSelectorCreator, defaultMemoize } from 'reselect';

/**
 * Creates a selector that uses shallow equality instead of deep equality.
 * Useful when combining multiple selectors into a composite state.
 */
export const createShallowSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual,
);
