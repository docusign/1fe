import { renderHook } from '@testing-library/react-hooks';
import React, { DependencyList, EffectCallback } from 'react';

import { initUseSubscribe } from '../use-subscribe'; // Replace with the path to your useSubscribe file
import { SubscriptionToEventBusArgs } from '../types';

// Define sample types for EventMap and EventPublishPayload
type EventMap = {
  testEvent: string;
  event2: number;
  // Add more events as needed...
};

describe('useSubscribe', () => {
  let subscribeMock: jest.Mock<any, any, any>;
  let useEffectSpy: jest.SpyInstance<
    void,
    [effect: EffectCallback, deps?: DependencyList | undefined],
    any
  >;

  beforeEach(() => {
    subscribeMock = jest.fn();
    useEffectSpy = jest.spyOn(React, 'useEffect');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call subscribe function when hook is called', () => {
    const eventName = 'testEvent';
    const listener = jest.fn();

    const subscriptionArgs: SubscriptionToEventBusArgs<
      EventMap,
      keyof EventMap
    > = {
      eventName,
      listener,
    };

    renderHook(() => initUseSubscribe(subscribeMock)(subscriptionArgs));

    expect(subscribeMock).toHaveBeenCalledWith({ eventName, listener });
  });

  it('should call useEffect with the correct dependencies', () => {
    const eventName = 'testEvent';
    const listener = jest.fn();

    const subscriptionArgs: SubscriptionToEventBusArgs<
      EventMap,
      keyof EventMap
    > = {
      eventName,
      listener,
    };

    renderHook(() => initUseSubscribe(subscribeMock)(subscriptionArgs));

    expect(useEffectSpy).toHaveBeenCalledWith(expect.any(Function), [
      eventName,
      listener,
    ]);
  });
});
