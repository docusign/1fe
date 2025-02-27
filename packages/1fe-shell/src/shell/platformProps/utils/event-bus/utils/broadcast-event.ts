import { registeredWidgets } from '..';

import { getEmitteryInstance } from './emittery-instance';
import { getNamespacedEvent } from './get-namespaced-event';

export const broadcastEvent = <EventMap, K extends keyof EventMap>(
  eventName: K,
  data: unknown,
) => {
  for (const widgetId of registeredWidgets) {
    getEmitteryInstance().emit(
      getNamespacedEvent<EventMap, K>(eventName, widgetId),
      data,
    );
  }
};
