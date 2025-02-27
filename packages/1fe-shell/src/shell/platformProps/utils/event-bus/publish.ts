import {
  EventBusPlatformUtils,
  EventPublishPayload,
  PublishToEventBusArgs,
} from './types';
import { getNamespacedEvent } from './utils/get-namespaced-event';
import { broadcastEvent } from './utils/broadcast-event';
import { emitteryInstance } from './utils/emittery-instance';
import { ONE_FE_SHELL_ID } from '../../../constants/event-bus';

/**
 * Returns a function that can be used to publish events on the event bus.
 * Caling the publish function returns void
 * @param widgetId string - the widgetId of the widget that is subscribing to the event
 * @returns publish function that can be used to publish events on the event bus
 */
export const initPublishToEventBus = (
  widgetId: string,
): EventBusPlatformUtils['publish'] => {
  return function publish<EventMap, K extends keyof EventMap>({
    targetWidgetId,
    eventName,
    data,
  }: PublishToEventBusArgs<EventMap, K>) {
    // This signature MUST NOT change
    // This is the data payload subscribed listeners are expecting
    // This should be treated as an API and only additive changes are permitted
    const dataPayloadForSubscriber: EventPublishPayload<EventMap[K]> = {
      // unique identifier for the widget that is sending the event
      eventInfo: {
        sender: {
          id: widgetId,
        },
        timestamp: Date.now(),
      },
      // original data payload that is being sent
      data,
    };

    // only 1DS Shell is allowed to broadcast to all widgets
    if (widgetId === ONE_FE_SHELL_ID && targetWidgetId === '*') {
      broadcastEvent<EventMap, K>(eventName, dataPayloadForSubscriber);

      // must return here to prevent emitting the event twice
      return;
    } else {
      // Most common usecase for widgets to use
      emitteryInstance.emit(
        getNamespacedEvent<EventMap, K>(eventName, targetWidgetId),
        dataPayloadForSubscriber,
      );
    }
  };
};
