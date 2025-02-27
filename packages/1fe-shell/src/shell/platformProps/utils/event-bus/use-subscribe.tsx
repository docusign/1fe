import { useEffect } from 'react';

import { SubscriptionToEventBusArgs } from './types';

export const initUseSubscribe = (
  subscribe: <EventMap, K extends keyof EventMap>(
    args: SubscriptionToEventBusArgs<EventMap, K>,
  ) => void,
) => {
  return function useSubscribe<EventMap, K extends keyof EventMap>({
    eventName,
    listener,
  }: SubscriptionToEventBusArgs<EventMap, K>): void {
    useEffect(() => {
      const dispose = subscribe({
        eventName,
        listener,
      });

      return dispose;
    }, [eventName, listener]);
  };
};
