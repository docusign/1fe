export const getNamespacedEvent = <EventMap, K extends keyof EventMap>(
  eventName: K,
  targetOrSenderWidgetId: string,
): K => {
  return `${targetOrSenderWidgetId}::${String(eventName)}` as K;
};
