import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import serialize from 'serialize-javascript';

import { Widget } from '../../services/widget';
import { appThunks } from '../../store/app/thunks';
import { propsValidation } from '../../store/utils';

import { AppState } from './types';

const STORAGE_KEY = 'bathtub';
const WIDGET_URL_KEY = 'url';
const WIDGET_PROPS_KEY = 'props';

const widgetsAdapter = createEntityAdapter<Widget>({
  selectId: (entity) => entity.widgetId,
  sortComparer: (a, b) => a.widgetId.localeCompare(b.widgetId),
});

const initialState: AppState = widgetsAdapter.getInitialState({
  loading: true,
  error: undefined,
  activeWidgetUrl: undefined,
  activeWidgetProps: serialize(
    {
      kitchenSink: 'testing',
    },
    { unsafe: true, space: 2 },
  ),
  isPropsEditorOpen: false,
  tickTock: false,
  isWidgetSwitcherOpen: false,
  environment: 'integration' as any, // TODO
  hasPropsError: false,
});

const appStateSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    setActiveWidgetUrl: (state, action: PayloadAction<string>) => {
      state.activeWidgetUrl = action.payload;
      state.isWidgetSwitcherOpen = false;
      sessionStorage.setItem(
        `${STORAGE_KEY}-${WIDGET_URL_KEY}`,
        action.payload,
      );
    },

    setActiveWidgetProps: (state, action: PayloadAction<string>) => {
      if (propsValidation(action.payload)) {
        state.activeWidgetProps = action.payload;
        state.isPropsEditorOpen = false;
        state.hasPropsError = false;
        sessionStorage.setItem(
          `${STORAGE_KEY}-${WIDGET_PROPS_KEY}`,
          action.payload,
        );
      } else {
        state.hasPropsError = true;
      }
    },

    clearPropsError: (state) => {
      state.hasPropsError = false;
    },

    setIsPropsEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.isPropsEditorOpen = action.payload;
      state.activeWidgetProps =
        tryGetLastUsedWidgetProps() ?? state.activeWidgetProps;
      const isValid = propsValidation(state.activeWidgetProps);
      state.hasPropsError = !isValid;
    },

    setIsWidgetSwitcherOpen: (state, action: PayloadAction<boolean>) => {
      state.isWidgetSwitcherOpen = action.payload;
    },

    renderWidget: (state) => {
      state.activeWidgetProps =
        tryGetLastUsedWidgetProps() ?? state.activeWidgetProps;

      // Fetch info from local storage if available
      state.activeWidgetUrl =
        tryGetLastUsedWidgetUrl() ?? state.activeWidgetUrl;

      state.tickTock = !state.tickTock;
    },

    reset: () => {
      sessionStorage.removeItem(`${STORAGE_KEY}-${WIDGET_URL_KEY}`);
      sessionStorage.removeItem(`${STORAGE_KEY}-${WIDGET_PROPS_KEY}`);
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(appThunks.loadWidgets.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(appThunks.loadWidgets.rejected, (state, action) => {
      state.loading = false;
      state.error = `[${action.error.name} (${action.error.code})] ${action.error.message}

Stack:
${action.error.stack}`;
    });

    builder.addCase(appThunks.loadWidgets.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      const [widgets, url] = action.payload;
      widgetsAdapter.setAll(state, widgets as any); // TODO: fix any

      state.activeWidgetProps =
        tryGetLastUsedWidgetProps() ?? state.activeWidgetProps;

      // Fetch info from local storage if available
      // TODO: fix any
      (state as any).activeWidgetUrl =
        url ?? tryGetLastUsedWidgetUrl() ?? state.activeWidgetUrl;

      if (state.activeWidgetUrl) {
        sessionStorage.setItem(
          `${STORAGE_KEY}-${WIDGET_URL_KEY}`,
          state.activeWidgetUrl,
        );
      }
    });
  },
});

const tryGetLastUsedWidgetUrl = (): string | undefined => {
  const url = sessionStorage.getItem(`${STORAGE_KEY}-${WIDGET_URL_KEY}`);
  if (url) {
    return url;
  }
  return undefined;
};

const tryGetLastUsedWidgetProps = (): string | undefined => {
  const props = sessionStorage.getItem(`${STORAGE_KEY}-${WIDGET_PROPS_KEY}`);
  if (props) {
    return props;
  }
  return undefined;
};

export const { actions: appActions, reducer: appReducer } = appStateSlice;
export { widgetsAdapter };
