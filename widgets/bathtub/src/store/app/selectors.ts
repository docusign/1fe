import { createSelector } from '@reduxjs/toolkit';

import { Environment } from '../../services/cdn';
import { RootState } from '../../store/index';

import { widgetsAdapter } from './app';

const selectApp = (state: RootState) => state.app;

const selectActiveWidgetUrl = createSelector(
  selectApp,
  (app) => app.activeWidgetUrl,
);

const selectActiveWidgetProps = createSelector(
  selectApp,
  (app) => app.activeWidgetProps,
);

const selectWidgetRefreshSignal = createSelector(
  selectApp,
  (app) => app.tickTock,
);

const { selectAll, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors();

const selectAllWidgets = (state: RootState) => selectAll(selectApp(state));

const selectAllPlugins = createSelector(selectAllWidgets, (widgets) =>
  widgets.filter((widget) => Boolean(widget.route)),
);

const selectWidget = (state: RootState) =>
  selectWidgetById(selectApp(state), selectApp(state).activeWidgetUrl ?? '');

const selectEnvironment = (state: RootState) =>
  selectApp(state).environment as Environment;

const selectLoadingOrError = createSelector(selectApp, (app) => ({
  isLoading: app.loading,
  error: app.error,
}));

export {
  selectActiveWidgetProps,
  selectActiveWidgetUrl,
  selectAllPlugins,
  selectAllWidgets,
  selectApp,
  selectEnvironment,
  selectLoadingOrError,
  selectWidget,
  selectWidgetById,
  selectWidgetRefreshSignal,
};
