import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { widgetBrowserReducer } from '../store/widgetBrowser';

import { appReducer } from './app';

export const store = configureStore({
  reducer: {
    app: appReducer,
    widgetBrowser: widgetBrowserReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { createShallowSelector } from './utils';
