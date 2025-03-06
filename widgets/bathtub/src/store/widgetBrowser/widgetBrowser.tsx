// import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

// import { RootState } from '../../store';
// import { selectAllWidgets } from '../../store/app/selectors';
// import {
//   getFilterBarConfiguration,
//   searchAndFilterWidgets,
// } from '../../store/widgetBrowser/filters';
// import type { Filter, SearchOptions } from '../../../../types/widgets/shared/filterBar';

// type WidgetBrowserState = {
//   filters: Filter[];
//   searchOptions: SearchOptions;
//   variants?: string[];
//   pickedVariant: string;
// };

// export const DEFAULT_VARIANT = 'default';

// const initialState: WidgetBrowserState = {
//   filters: getFilterBarConfiguration(),
//   searchOptions: {
//     defaultSearches: [],
//     appliedSearch: '',
//     placeholder: 'Search for a widget',
//     autofocus: true,
//   },
//   pickedVariant: DEFAULT_VARIANT,
// };

// const widgetBrowserSlice = createSlice({
//   initialState,
//   name: 'widgetBrowser',
//   reducers: {
//     applySearch(state, action: PayloadAction<string>) {
//       state.searchOptions.appliedSearch = action.payload;
//     },

//     applyFilters(state, action: PayloadAction<Filter[]>) {
//       state.filters = action.payload;
//     },

//     updateVariants(state, action: PayloadAction<string[]>) {
//       console.log('updateVariants', action.payload); // eslint-disable-line no-console
//       state.variants = action.payload;
//       state.pickedVariant = DEFAULT_VARIANT;
//     },

//     updateSuggestions(
//       state,
//       action: PayloadAction<{ value: string; type: string }[]>,
//     ) {
//       state.searchOptions.defaultSearches = action.payload;
//     },

//     clearVariants(state) {
//       state.variants = undefined;
//       state.pickedVariant = DEFAULT_VARIANT;
//     },

//     pickVariant(state, action: PayloadAction<string>) {
//       if (
//         state.variants?.includes(action.payload) &&
//         action.payload !== state.pickedVariant
//       ) {
//         state.pickedVariant = action.payload;
//       }
//     },
//   },
// });

// const selectWidgetBrowser = (state: RootState) => state.widgetBrowser;

// const selectFilterBarConfiguration = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => ({
//     filters: structuredClone(widgetBrowser.filters),
//     searchOptions: structuredClone(widgetBrowser.searchOptions),
//   }),
// );

// const selectFilteredWidgets = createSelector(
//   [selectAllWidgets, selectFilterBarConfiguration],
//   (widgets, { filters, searchOptions }) => {
//     return searchAndFilterWidgets(widgets, filters, searchOptions);
//   },
// );

// const selectVariants = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => widgetBrowser.variants,
// );

// const selectPickedVariant = createSelector(
//   selectWidgetBrowser,
//   (widgetBrowser) => widgetBrowser.pickedVariant,
// );

// const widgetBrowserSelectors = {
//   selectFilteredWidgets,
//   selectFilterBarConfiguration,
//   selectVariants,
//   selectPickedVariant,
// };

// const { actions: widgetBrowserActions, reducer: widgetBrowserReducer } =
//   widgetBrowserSlice;

// export { widgetBrowserActions, widgetBrowserReducer, widgetBrowserSelectors };

import { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';

export function WidgetBrowser() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const widgetConfigScript = document.querySelector(
      // TODO: we should use a different tag
      'script[data-1ds-config-id="widget-config"]',
    );
    if (widgetConfigScript) {
      try {
        const config = JSON.parse(widgetConfigScript.textContent || '[]');
        setWidgets(config);
      } catch (error) {
        console.error('Error parsing widget config JSON:', error);
      }
    }
  }, []);

  const columns = [
    {
      title: 'Widget ID',
      dataIndex: 'widgetId',
      key: 'widgetId',
    },
    {
      title: 'Route',
      dataIndex: ['plugin', 'route'],
      key: 'route',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Has Auth',
      dataIndex: ['plugin', 'auth'],
      key: 'auth',
      render: (auth) => (auth ? 'true' : 'false'),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Widget Browser</Typography.Title>
      <Table
        dataSource={widgets}
        columns={columns}
        rowKey="widgetId"
        locale={{ emptyText: 'No widget configuration found.' }}
      />
    </div>
  );
}
