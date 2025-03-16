// import { platformProps } from '@1fe/shell';
import { Button } from 'antd';
import { useReducer } from 'react';

import { GetChildWidget } from '../misc/utils';
import { WidgetContainer } from '../misc/widgetContainer';
// import { useTranslate } from 'src/locales';
export const EventBus = (props: any) => {
  const [isVisible, showWidget] = useReducer(() => true, false);

  // const t = useTranslate();

  type WidgetEvents = {
    event1: { param1: string };
    event2: { param2: string };
  };

  return (
    <div data-qa="utils.eventBus.container">
      <h1>utils.eventBus</h1>
      {/* <h1>{t('Components.EventBus.Index')}</h1> */}
      <Button data-qa="utils.eventBus.get.btn" onClick={showWidget}>
        utils.eventBus.get.test
        {/* {t('Components.EventBus.GetButtonText')} */}
      </Button>
      <Button
        data-qa="utils.eventBus.publish1.btn"
        onClick={() => {
          // @ts-ignore
          props.platform.utils.eventBus.publish<WidgetEvents, 'event1'>({
            targetWidgetId: '@1fe/starter-kit2',
            eventName: 'event1',
            data: { param1: 'Listener is working!' },
          });

          // platformProps.utils.eventBus.publish<WidgetEvents, 'event1'>({
          //   targetWidgetId: '@internal/generic-child-widget',
          //   eventName: 'event1',
          //   data: { param1: 'Listener is working!' },
          // });
        }}
      >
        utils.eventBus.test.publish1
        {/* {t('Components.EventBus.PublishButtonText1')} */}
      </Button>
      <Button
        data-qa="utils.eventBus.publish2.btn"
        onClick={() => {
          // @ts-ignore
          props.platform.utils.eventBus.publish<WidgetEvents, 'event2'>({
            targetWidgetId: '@internal/generic-child-widget',
            eventName: 'event2',
            data: { param2: 'Test 2 should not fire' },
          });

          // platformProps.utils.eventBus.publish<WidgetEvents, 'event2'>({
          //   targetWidgetId: '@internal/generic-child-widget',
          //   eventName: 'event2',
          //   data: { param2: 'Test 2 should not fire' },
          // });
        }}
      >
        utils.eventBus.test.publish2
        {/* {t('Components.EventBus.PublishButtonText2')} */}
      </Button>
      {isVisible && (
        <WidgetContainer data-qa="utils.widgets.eventBus.result.container">
          <GetChildWidget
            isVisible={isVisible}
            props={props}
            widgetId={'@1fe/starter-kit2'}
          />
        </WidgetContainer>
      )}
    </div>
  );
};
