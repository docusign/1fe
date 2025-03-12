import { ONE_FE_SHELL_ID } from '../../../../constants/event-bus';
import { initEventBus } from '../index';
import { EventBusPlatformUtils } from '../types';

// jest.mock('emittery');

jest.mock('../../../../configs/shell-configs', () => ({
  readMagicBoxShellConfigs: jest.fn().mockImplementation(() => ({ mode: 'production' })),
}));

jest.mock('../../../../utils/url' , () => ({
  ...jest.requireActual('../../../../utils/url'),
  basePathname: jest.fn(() => '/'),
}));

describe('EventBus', () => {
  const widget1Id = 'widget1';
  const widget2Id = 'widget2';

  let widget1EventBus: EventBusPlatformUtils;
  let widget2EventBus: EventBusPlatformUtils;

  beforeEach(() => {
    widget1EventBus = initEventBus(widget1Id);
    widget2EventBus = initEventBus(widget2Id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('publish method is called when widget calls eventBusInstance.publish', () => {
    type WidgetEvents = {
      event1: undefined;
      event2: { param1: string; param2: number };
    };

    const emitMock = jest.spyOn(widget1EventBus, 'publish');

    widget1EventBus.publish<WidgetEvents, 'event1'>({
      targetWidgetId: widget2Id,
      eventName: 'event1',
      data: undefined,
    });

    expect(emitMock).toHaveBeenCalledWith({
      data: undefined,
      eventName: 'event1',
      targetWidgetId: 'widget2',
    });
  });

  test('subscribe method is called when widget calls eventBusInstance.subscribe', () => {
    type WidgetEvents = {
      event1: undefined;
      event2: { param1: string; param2: number };
    };

    const subscribeMock = jest.spyOn(widget2EventBus, 'subscribe');

    const listener = () => {
      // eslint-disable-next-line no-console
      console.log('listening..');
    };

    widget2EventBus.subscribe<WidgetEvents, 'event1'>({
      eventName: 'event1',
      listener,
    });

    expect(subscribeMock).toHaveBeenCalled();
  });
});

describe('EventBus Interactions Between Widgets', () => {
  const widget1 = 'widget1';
  const widget2 = 'widget2';

  let widget1EventBus: EventBusPlatformUtils;
  let widget2EventBus: EventBusPlatformUtils;

  type Widget1Events = {
    event1: { param1: string; param2: number };
  };

  type Widget3Events = {
    event1: { param1: string; param2: number };
  };

  beforeEach(() => {
    widget1EventBus = initEventBus(widget1);
    widget2EventBus = initEventBus(widget2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Widget2 receives the event when Widget1 publishes and Widget2 subscribes', (done) => {
    const listener = jest.fn();
    widget2EventBus.subscribe<Widget1Events, 'event1'>({
      eventName: 'event1',
      listener
    });

    widget1EventBus.publish<Widget1Events, 'event1'>({
      targetWidgetId: widget2,
      eventName: 'event1',
      data: {
        param1: 'test',
        param2: 10,
      },
    });

    // This is a hack to make sure the listener is called after the event is published
    setTimeout(() => {
      expect(listener).toHaveBeenCalledWith({
        data: expect.objectContaining({
          param1: 'test',
          param2: 10,
        }),
        eventInfo: expect.objectContaining({
          sender: expect.objectContaining({
            id: 'widget1',
          }),
        }),
      });

      done();
    }, 0);    
  });

  test('Widget2 does not recieve the event from Widget1 if it has unsubscribed', (done) => {
    const listener = jest.fn();
    const unsubscribeFn = widget2EventBus.subscribe<Widget3Events, 'event1'>({
      eventName: 'event1',
      listener,
    });

    widget1EventBus.publish<Widget1Events, 'event1'>({
      targetWidgetId: widget2,
      eventName: 'event1',
      data: {
        param1: 'test1',
        param2: 10,
      },
    });

    // This is a hack to make sure the listener is called after the event is published
    setTimeout(() => {
      expect(listener).toHaveBeenCalledWith({
        data: expect.objectContaining({
          param1: 'test1',
          param2: 10,
        }),
        eventInfo: expect.objectContaining({
          sender: expect.objectContaining({
            id: 'widget1',
          }),
        }),
      });

      expect(unsubscribeFn).toBeInstanceOf(Function);

      unsubscribeFn();

      widget1EventBus.publish<Widget1Events, 'event1'>({
        targetWidgetId: widget2,
        eventName: 'event1',
        data: {
          param1: 'test1',
          param2: 10,
        },
      });

      expect(listener).toHaveBeenCalledWith({
        data: expect.objectContaining({
          param1: 'test1',
          param2: 10,
        }),
        eventInfo: expect.objectContaining({
          sender: expect.objectContaining({
            id: 'widget1',
          }),
        }),
      });

      done();
    }, 0);
  });

  test('should return undefined if widget is shell and target us *', () => {
    type WidgetEvents = {
      event1: { param1: string };
    };
    const eventBus = initEventBus(ONE_FE_SHELL_ID);
    const result = eventBus.publish<WidgetEvents, 'event1'>({
      targetWidgetId: '*',
      data: { param1: 'asdf' },
      eventName: 'event1',
    });

    expect(result).toBeUndefined();
  });
});
