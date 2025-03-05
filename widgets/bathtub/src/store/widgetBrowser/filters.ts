// import { Widget } from '../../services/widget';
// import { isNotNullable } from '../../store/utils';
// import type { Filter, SearchOptions } from '../../types/widgets/shared/filterBar';

// type FilterType = {
//   name: string;
//   filters: Record<
//     string,
//     {
//       name: string;
//       value: string;
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       filter: (widget: Widget) => boolean;
//     }
//   >;
// };

// type FiltersType = Record<string, FilterType>;

// const FILTERS: FiltersType = {
//   id: {
//     name: 'Type',
//     filters: {
//       widgets: {
//         name: 'Widgets',
//         value: 'widgets',
//         filter: (widget: Widget) => {
//           return widget.isPlugin !== true;
//         },
//       },
//       plugins: {
//         name: 'Plugins',
//         value: 'plugins',
//         filter: (widget: Widget) => {
//           return widget.isPlugin === true;
//         },
//       },
//       shared: {
//         name: 'Shared',
//         value: 'shared',
//         filter: (widget: Widget) => {
//           return widget.widgetId.startsWith('@shared');
//         },
//       },
//     },
//   },
//   availability: {
//     name: 'Availabilityy',
//     filters: {
//       integration: {
//         name: 'Integration',
//         value: 'integration',
//         filter: (widget: Widget) => {
//           return !!widget.lastModified.integration?.widgetVersion;
//         },
//       },
//       stage: {
//         name: 'Stage',
//         value: 'stage',
//         filter: (widget: Widget) => {
//           return !!widget.lastModified.stage?.widgetVersion;
//         },
//       },
//       demo: {
//         name: 'Demo',
//         value: 'demo',
//         filter: (widget: Widget) => {
//           return !!widget.lastModified.demo?.widgetVersion;
//         },
//       },
//       production: {
//         name: 'Production',
//         value: 'production',
//         filter: (widget: Widget) => {
//           return !!widget.lastModified.production?.widgetVersion;
//         },
//       },
//     },
//   },
// };

// function* applySearch(
//   widgets: Generator<Widget>,
//   searchOptions: SearchOptions,
// ): Generator<Widget> {
//   if (!searchOptions) {
//     yield* widgets;
//   }

//   for (const widget of widgets) {
//     if (widget.widgetId.includes(searchOptions.appliedSearch)) {
//       yield widget;
//     }
//   }
// }

// function* applyFilter(widgets: Widget[], filters: Filter[]) {
//   const selectedFilters = filters.reduce((prev, filter) => {
//     if (filter.type != 'MultiSelect' || !filter.id) {
//       return prev;
//     }

//     const filterConfig = FILTERS[filter.id];
//     if (!filterConfig) {
//       return prev;
//     }

//     const appliedFilters = filter.values
//       .map((value) => {
//         const filter = filterConfig.filters[value.id];
//         if (!filter) {
//           return;
//         }
//         return filter.filter;
//       })
//       .filter(isNotNullable);

//     return [...prev, ...appliedFilters];
//   }, [] as ((widget: Widget) => boolean)[]);

//   if (selectedFilters.length === 0) {
//     yield* widgets;
//     return;
//   }

//   for (const widget of widgets) {
//     if (selectedFilters.every((filter) => filter(widget))) {
//       yield widget;
//     }
//   }
// }

// export function getFilterBarConfiguration(): Filter[] {
//   return Object.entries(FILTERS).map(([id, filter]) => {
//     return <Filter>{
//       id,
//       label: filter.name,
//       type: 'MultiSelect',
//       options: Object.entries(filter.filters).map(([id, filter]) => {
//         return {
//           id,
//           label: filter.name,
//         };
//       }),
//       values: [],
//     };
//   });
// }

// export function searchAndFilterWidgets(
//   widgets: Widget[],
//   filters: Filter[],
//   searchOptions: SearchOptions,
// ): Widget[] {
//   const filtered = applyFilter(widgets, filters);
//   const matchedWidgets = applySearch(filtered, searchOptions);
//   return Array.from(matchedWidgets);
// }
