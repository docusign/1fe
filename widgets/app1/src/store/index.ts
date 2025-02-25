import { configureStore } from '@reduxjs/toolkit';

import helloReducer from './slices/hello';

/**
 * Creates a Redux store that's isolated to this widget
 */
export const createStore = () => {
  const store = configureStore({
    reducer: {
      hello: helloReducer,
    },
  });

  return store;
};

// Export types for the store, root state, and dispatch
export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
