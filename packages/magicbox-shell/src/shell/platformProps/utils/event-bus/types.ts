import { UnsubscribeFunction } from 'emittery';

// import { PlatformUtilHistoryEvent } from '../../../components/system-widgets/Devtool/platformUtilHistoryCache';
import { IFRAME_MESSAGE, PLATFORM_UTIL_HISTORY } from '../../../constants/event-bus';

export type PublishToEventBusArgs<EventMap, K extends keyof EventMap> = {
  targetWidgetId: string;
  eventName: K;
  data: EventMap[K];
};

export type SubscriptionToEventBusArgs<EventMap, K extends keyof EventMap> = {
  /**
   * The name of the event to subscribe to
   */
  eventName: K;

  /**
   * The function to call when the event is emitted
   * @param data - Event payload
   */
  listener: (data: EventPublishPayload<EventMap[K]>) => void;
};

export type EventBusPlatformUtils = {
  /**
   * This function is used by widgets to publish events to other widgets.
   * The published event targets a specific widgetId, and will only be received by that widget.
   *
   * Be sure to understand the structure of the data payload the target widget is expecting for it to work correctly.
   *
   * @example publish({ eventName: 'EVENT_WIDGET_48_IS_SUBSCRIBED_TO', targetWidgetId: '@docusign/widget-48', data: { foo: 'bar' } })
   * @param targetWidgetId string - the widgetId of the widget that is subscribing to the event
   * @param eventName string - the name of the event to publish
   * @param data any - the data to send with the event
   * @returns void
   */
  publish<EventMap, K extends keyof EventMap>(
    args: PublishToEventBusArgs<EventMap, K>,
  ): void;

  /**
   * A function that can be used to subscribe to an event, that is automatically namespaced to your widgetId.
   * Calling the returned function will unsubscribe from the event.
   *
   * CAUTION: Calling this function multiple times will result in multiple subscriptions. Do not use this in a React Component that will re-render multiple times. Please use the useSubscribe hook instead.
   *
   * @example const unsubscribeFn = subscribe({ eventName: 'EVENT_WIDGET_48_IS_SUBSCRIBED_TO', listener: (data) => { console.log('event emitted with data', data) } })
   * @param args - An eventName and listener pair
   * @returns unsubscribeFn - function that can be used to unsubscribe from the event
   */
  subscribe<EventMap, K extends keyof EventMap>(
    args: SubscriptionToEventBusArgs<EventMap, K>,
  ): UnsubscribeFunction;

  /**
   * A hook wrapper around subscribe that handles React lifecycle
   * This hook is used by the platform to subscribe to events
   * And will auto unsubscribe when the component is unmounted
   *
   * @param args - An eventName and listener pair
   * @example useSubscribe({ eventName: 'event-name', listener: (data) => {} })
   * @returns void
   */
  useSubscribe<EventMap, K extends keyof EventMap>(
    args: SubscriptionToEventBusArgs<EventMap, K>,
  ): void;
};

export type EventPublishPayload<T> = {
  eventInfo: {
    sender: {
      id: string;
    };
    timestamp: number;
  };
  data: T;
};

export type ShellEvents = {
  [IFRAME_MESSAGE]: MessageEvent;
  // [PLATFORM_UTIL_HISTORY]: PlatformUtilHistoryEvent[];
};
