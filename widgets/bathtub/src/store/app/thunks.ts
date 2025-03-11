import { createAsyncThunk } from '@reduxjs/toolkit';

import { WIDGET, WIDGET_ID, WIDGET_URL } from '../../constants';
// import { getWidgets } from '../../services/widget';
// import { widgetBrowserActions } from '../../store/widgetBrowser';

const loadWidgets = createAsyncThunk(
  'app/refreshWidgets',
  async (_, { dispatch }) => {
    try {
      // const widgets = getWidgets()

      // read off DOM instead of /version
      const widgetConfigScript = document.querySelector(
        'script[data-1fe-config-id="widget-config"]',
      );
      const widgets = JSON.parse(widgetConfigScript.textContent || '[]');

      // const widgetSuggestions = widgets
      //   .filter((config) => !!config.lastModified.integration?.widgetVersion)
      //   .map((config) => ({
      //     value: config.widgetId,
      //     type: config.lastModified.integration?.widgetVersion ?? 'unknown',
      //   }));

      const urlParams = new URLSearchParams(window.location.search);
      const maybeWidgetName = urlParams.get(WIDGET_ID) || urlParams.get(WIDGET);
      const widget = widgets.find(
        (widget) => widget.widgetId === maybeWidgetName,
      );

      const getWidgetOverride = () => {
        if (widget) {
          return (
            window.importMapOverrides?.getOverrideMap()?.imports[
              widget.widgetId
            ] ?? widget.lastModified.integration?.bundleUrl
          );
        }

        return urlParams.get(WIDGET_URL) ?? maybeWidgetName;
      };

      // dispatch(widgetBrowserActions.updateSuggestions(widgetSuggestions));

      return [widgets, getWidgetOverride()];
    } catch (error) {
      console.error(error);

      throw error;
    }
  },
);

export const appThunks = {
  loadWidgets,
};
