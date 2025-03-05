// import { AutoSuggest, renderTaggedSearchHits } from '@ds/components';
// import { isEnter } from '@ds/react-utils';
// import { KeyboardEvent, ReactElement, memo, useCallback, useRef } from 'react';

// import { Row } from 'src/components/layout';
// import { Widget } from 'src/services/widget';
// import { useAppSelector } from 'src/store';
// import { selectAllWidgets } from 'src/store/app';

// type WidgetSearchProps = {
//   currentUrl: string | undefined;
//   onChange: (url: string) => void;
// };

// const MAX_RESULTS = 7;

// const WidgetSearch = memo(
//   ({ currentUrl, onChange }: WidgetSearchProps): ReactElement => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     const widgets = useAppSelector(selectAllWidgets);

//     const isOptionSelected = useCallback(
//       (option: Widget) =>
//         option.lastModified.integration?.bundleUrl === currentUrl,
//       [currentUrl],
//     );

//     const selectedOption = widgets.find(isOptionSelected);

//     const onTypeaheadChange = useCallback(
//       async (newInputText: string) => {
//         if (!newInputText) {
//           return widgets;
//         }
//         return widgets
//           .filter((option) => {
//             return option.widgetId
//               .toLowerCase()
//               .includes(newInputText.toLowerCase());
//           })
//           .slice(0, MAX_RESULTS);
//       },
//       [widgets],
//     );

//     const onTypeaheadSelect = useCallback(
//       (option?: Widget) => {
//         if (!option) return;

//         if (isOptionSelected(option)) {
//           return;
//         }

//         onChange(option.lastModified.integration?.bundleUrl ?? '');

//         if (inputRef.current) {
//           inputRef.current.blur();
//         }
//       },
//       [isOptionSelected, onChange],
//     );

//     const onKeyDown = useCallback(
//       (event: KeyboardEvent) => {
//         const isSelectingOption = event.currentTarget.querySelector(
//           'li[data-targeted=true]',
//         );
//         if (isEnter(event) && !isSelectingOption) {
//           const activeOption = widgets.find(isOptionSelected);
//           onTypeaheadSelect(activeOption);
//         }
//       },
//       [isOptionSelected, onTypeaheadSelect, widgets],
//     );

//     return (
//       <AutoSuggest<Widget>
//         searchText={selectedOption?.widgetId}
//         onKeyDownCapture={onKeyDown}
//         width='100%'
//         data-qa='searchBox'
//         label='Select a widget'
//         placeholder='@1fe/starter-widget'
//         debounce={50}
//         showBusy
//         onHit={onTypeaheadSelect}
//         onSearch={onTypeaheadChange}
//         forwardedRef={inputRef}
//         renderHit={(option, search) => (
//           <Row justify='space-between'>
//             {renderTaggedSearchHits(option.widgetId, search, 'strong')}
//             {option.lastModified.integration?.widgetVersion}
//           </Row>
//         )}
//         hitsAccessabilityTitle='searchBox'
//       />
//     );
//   },
// );

// export { WidgetSearch };
