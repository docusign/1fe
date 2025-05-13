import { platformProps } from '@1fe/shell';
import { useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { WidgetProps, WidgetEvents } from './contract';

export default function Root(props: WidgetProps) {
  useEffect(() => {
    platformProps.utils.appLoadTime.end();
  }, []);

  const [eventBusResult, setEventBusResult] = useState('unchanged');
  const [unsubscribeFn, setUnsubscribeFn] = useState(() => () => {});

  const listener = useCallback(
    (event: any) => {
      setEventBusResult(JSON.stringify(event));
    },
    [setEventBusResult],
  );

  return (
    <>
      <p>My component from app2 is mounted!</p>
      <Button
        data-qa='eventBus.subscribe.btn'
        onClick={() => {
          const unsubFn = platformProps.utils.eventBus.subscribe<
            WidgetEvents,
            'event1'
          >({
            eventName: 'event1',
            listener,
          });
          setEventBusResult('subscribed');
          setUnsubscribeFn(() => unsubFn);
        }}
      >
        utils.eventBus.subscribe
      </Button>
      <Button
        data-qa='eventBus.unsubscribe.btn'
        onClick={() => {
          setEventBusResult('unsubscribed');
          unsubscribeFn();
        }}
      >
        utils.eventBus.unsubscribe
      </Button>
      <div data-qa='eventBus.result.container'>{eventBusResult}</div>
    </>
  );
}
