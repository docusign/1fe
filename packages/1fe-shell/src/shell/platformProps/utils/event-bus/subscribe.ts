import { EventBusPlatformUtils, SubscriptionToEventBusArgs } from './types';
import { getNamespacedEvent } from './utils/get-namespaced-event';
import { getEmitteryInstance } from './utils/emittery-instance';

/**
 * Returns a function that can be used to subscribe to events on the event bus.
 * When the subscribe function is called, it will return a function that can be used to unsubscribe from the event.
 * @param widgetId string - the widgetId of the widget that is subscribing to the event
 * @returns function that can be used to subscribe to events on the event bus
 */
export const initSubscribeToEventBus = (
  widgetId: string,
): EventBusPlatformUtils['subscribe'] => {
  return function subscribe<EventMap, K extends keyof EventMap>({
    eventName,
    listener,
  }: SubscriptionToEventBusArgs<EventMap, K>) {
    const unsubscribeFunction = getEmitteryInstance().on(
      getNamespacedEvent<EventMap, K>(eventName, widgetId),
      listener,
    );

    return unsubscribeFunction;
  };
};
