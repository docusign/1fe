import React, { useState, useCallback } from "react";
import { Button } from 'antd';

type WidgetEvents = {
  event1: { param1: string };
};


export default function Root(props) {
  const [eventBusResult, setEventBusResult] = useState('unchanged');
  const [unsubscribeFn, setUnsubscribeFn] = useState(() => () => {});

  const listener = useCallback(
    (event: any) => {
      console.log('LISTERNER HIT');
      setEventBusResult(JSON.stringify(event));
    },
    [setEventBusResult],
  );

  console.log({app2Props: props});

  return (
    <>
      <p>My component from app2 is mounted!</p>
      <Button
        data-qa='eventBus.subscribe.btn'
        onClick={() => {
          // @ts-ignore
          const unsubFn = props.platform.utils.eventBus.subscribe<
            WidgetEvents,
            'event1'
          >({
            eventName: 'event1',
            listener,
          });
          setEventBusResult('subscribed');
          setUnsubscribeFn(() => unsubFn);
        }}
      >utils.eventBus.subscribe</Button>
      <Button
        data-qa='eventBus.unsubscribe.btn'
        onClick={() => {
          setEventBusResult('unsubscribed');
          unsubscribeFn();
        }}
      >utils.eventBus.unsubscribe</Button>
      <div data-qa='eventBus.result.container'>{eventBusResult}</div>
    </>
  );
}
