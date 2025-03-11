import { createAsyncThunk } from '@reduxjs/toolkit';

import { WIDGET, WIDGET_ID, WIDGET_URL } from '../../constants';
import { Widget } from '../../services/widget';
// import { getWidgets } from '../../services/widget';
// import { widgetBrowserActions } from '../../store/widgetBrowser';

const getWidgetsFromVersionEndpoint = async () => {
  const response = await fetch('/version');
  const widgets = (await response.json()).configs.widgetConfig as Widget[];
  return widgets;
};

const loadWidgets = createAsyncThunk(
  'app/refreshWidgets',
  async (_, { dispatch }) => {
    try {
      // const widgets = getWidgets();
      const widgets = await getWidgetsFromVersionEndpoint();

      // read off DOM instead of /version
      // const widgetConfigScript = document.querySelector(
      //   // TODO: we should use a different tag
      //   'script[data-1ds-config-id="widget-config"]',
      // );
      // const widgets = JSON.parse(widgetConfigScript.textContent || '[]');

      // const widgetSuggestions = widgets
      //   .filter((config) => !!config.lastModified.integration?.widgetVersion)
      //   .map((config) => ({
      //     value: config.widgetId,
      //     type: config.lastModified.integration?.widgetVersion ?? 'unknown',
      //   }));

      const urlParams = new URLSearchParams(window.location.search);
      console.log('----------------');
      console.log(urlParams);
      console.log('----------------');
      const maybeWidgetName = urlParams.get(WIDGET_ID) || urlParams.get(WIDGET);
      const widget = widgets.find(
        (widget) => widget.widgetId === maybeWidgetName,
      );

      const getWidgetOverride = () => {
        if (widget) {
          return (
            window.importMapOverrides?.getOverrideMap()?.imports[
              widget.widgetId
            ] ?? ''
          );
        }

        return urlParams.get(WIDGET_URL) ?? maybeWidgetName;
      };

      // dispatch(widgetBrowserActions.setWidgets(widgets));

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
