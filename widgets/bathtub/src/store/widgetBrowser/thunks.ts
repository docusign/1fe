// import { createAsyncThunk } from '@reduxjs/toolkit';

// import { RootState } from '../../store';
// import { widgetBrowserActions } from '../../store/widgetBrowser/widgetBrowser';

// const WIDGET_MODULE_KEYS = {
//   /**
//    * this key indicates that the widget has variants. It is always going to be `true` for now.
//    */
//   hasVariants: '__hasVariants',
//   /**
//    * The key that holds the array of variant ids for the widget.
//    */
//   variants: '__variants',
//   /**
//    * The key that holds the function that returns the widget.
//    */
//   getWidget: '__getWidget',
//   /**
//    * The key that holds the function that returns the variant.
//    */
//   getVariant: '__getVariant',
// };

// const refreshVariants = createAsyncThunk(
//   'widgetBrowser/refreshVariants',
//   async (_, { dispatch, getState }) => {
//     const state = getState() as RootState;
//     const widgetUrl = state.app.activeWidgetUrl;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const module = (await (window as any).System.import(widgetUrl)) as any;

//     if (
//       module.default?.[WIDGET_MODULE_KEYS.hasVariants] &&
//       module.default?.[WIDGET_MODULE_KEYS.variants]?.length
//     ) {
//       dispatch(
//         widgetBrowserActions.updateVariants(
//           module.default[WIDGET_MODULE_KEYS.variants],
//         ),
//       );
//     }
//   },
// );

// export const widgetBrowserThunks = {
//   refreshVariants,
// };
