import { WidgetConfigRaw } from "../../types";

export const widgetConfigPayload: WidgetConfigRaw[] = [
  {
    widgetId: 'testwidget',
    version: '1.2.0'
  },
  {
    widgetId: 'testwidget-active-phased-deployment',
    version: '2.4.5'
  },
  {
    widgetId: 'testwidget-with-url',
    version: '2.4.5'
  },
  {
    widgetId: 'testplugin-finished-phased-deployment',
    plugin: {
      enabled: true,
      route: '/testplugin-finished-phased-deployment',
      auth: {
        clientAppId: 'testplugin-finished-phased-deployment',
        scopes: ['testplugin-finished-phased-deployment'],
        secretKeyName: 'testplugin-finished-phased-deployment',
        callbackUri: 'testplugin-finished-phased-deployment',
        authenticationType: 'required',
      },
    },
    version: '2.0.0'
  },
];
