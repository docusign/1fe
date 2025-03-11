import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import { selectAllWidgets } from '../app/selectors';
// import {
//   getFilterBarConfiguration,
//   searchAndFilterWidgets,
// } from 'src/store/widgetBrowser/filters';

type WidgetBrowserState = {
  filters: any[];
  // searchOptions: any;
  // variants?: string[];
  // pickedVariant: string;
};

export const DEFAULT_VARIANT = 'default';

const initialState: WidgetBrowserState = {
  filters: [],
  // searchOptions: {
  //   defaultSearches: [],
  //   appliedSearch: '',
  //   placeholder: 'Search for a widget',
  //   autofocus: true,
  // },
  // pickedVariant: DEFAULT_VARIANT,
};

const widgetBrowserSlice = createSlice({
  initialState,
  name: 'widgetBrowser',
  reducers: {
    // applySearch(state, action: PayloadAction<string>) {
    //   state.searchOptions.appliedSearch = action.payload;
    // },

    applyFilters(state, action: PayloadAction<any[]>) {
      state.filters = action.payload;
    },

    // updateVariants(state, action: PayloadAction<string[]>) {
    //   console.log('updateVariants', action.payload); // eslint-disable-line no-console
    //   state.variants = action.payload;
    //   state.pickedVariant = DEFAULT_VARIANT;
    // },

    // updateSuggestions(
    //   state,
    //   action: PayloadAction<{ value: string; type: string }[]>,
    // ) {
    //   state.searchOptions.defaultSearches = action.payload;
    // },

    // clearVariants(state) {
    //   state.variants = undefined;
    //   state.pickedVariant = DEFAULT_VARIANT;
    // },

    // pickVariant(state, action: PayloadAction<string>) {
    //   if (
    //     state.variants?.includes(action.payload) &&
    //     action.payload !== state.pickedVariant
    //   ) {
    //     state.pickedVariant = action.payload;
    //   }
    // },
  },
});

const selectWidgetBrowser = (state: RootState) => state.widgetBrowser;

// const selectFilterBarConfiguration = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => ({
//     filters: structuredClone(widgetBrowser.filters),
//     searchOptions: structuredClone(widgetBrowser.searchOptions),
//   }),
// );

// TODO: add filtering back
const selectFilteredWidgets = createSelector([selectAllWidgets], (widgets) => {
  return widgets;
});

// const selectVariants = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => widgetBrowser.variants,
// );

// const selectPickedVariant = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => widgetBrowser.pickedVariant,
// );

const widgetBrowserSelectors = {
  selectFilteredWidgets,
  // selectFilterBarConfiguration,
  // selectVariants,
  // selectPickedVariant,
};

const { actions: widgetBrowserActions, reducer: widgetBrowserReducer } =
  widgetBrowserSlice;

export { widgetBrowserActions, widgetBrowserReducer, widgetBrowserSelectors };

/// ===========

// import { createSlice } from '@reduxjs/toolkit';

// export const widgetBrowserSlice = createSlice({
//   name: 'widget',
//   initialState: {
//     widgets: [],
//   },
//   reducers: {
//     setWidgets(state, action) {
//       state.widgets = action.payload;
//     },
//   },
// });

// export const { setWidgets } = widgetSlice.actions;
// export const widgetReducer = widgetSlice.reducer;

// widgetBrowserActions;
