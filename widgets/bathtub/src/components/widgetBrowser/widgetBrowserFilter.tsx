// import { memo, useCallback } from 'react';

// import { useAppDispatch, useAppSelector } from 'src/store';
// import {
//   widgetBrowserActions,
//   widgetBrowserSelectors,
// } from 'src/store/widgetBrowser';
// import type {
//   Filter,
//   FilterBarChangeType,
// } from 'src/types/widgets/shared/filterBar';

// const logOptions = {
//   appName: '@1fe/bathtub',
//   accountId: '',
// };

// const WidgetFilter = memo(() => {
//   const filterBarConfig = useAppSelector(
//     widgetBrowserSelectors.selectFilterBarConfiguration,
//   );
//   const dispatch = useAppDispatch();

//   const onFilterChanged = useCallback(
//     (
//       filters: Filter[],
//       searchQuery: string,
//       changeType: FilterBarChangeType,
//     ) => {
//       if (changeType === 'search') {
//         dispatch(widgetBrowserActions.applySearch(searchQuery));
//       } else {
//         dispatch(widgetBrowserActions.applyFilters(filters));
//       }
//     },
//     [dispatch],
//   );

//   const FilterBar = platformProps.utils.widgets.get('@shared/filter-bar');

//   return (
//     <FilterBar
//       filters={filterBarConfig.filters}
//       onChange={onFilterChanged}
//       searchOptions={filterBarConfig.searchOptions}
//       logOptions={logOptions}
//     />
//   );
// });

// export { WidgetFilter };
