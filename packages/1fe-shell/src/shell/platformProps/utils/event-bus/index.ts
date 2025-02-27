// import { getShellLogger } from '../../../utils/telemetry';

import { EventBusPlatformUtils } from './types';
import { initPublishToEventBus } from './publish';
import { initSubscribeToEventBus } from './subscribe';
import { initUseSubscribe } from './use-subscribe';

// const logger = getShellLogger();

export const registeredWidgets: Set<string> = new Set();

export const initEventBus = (widgetId: string): EventBusPlatformUtils => {
  if (!registeredWidgets.has(widgetId)) {
    // logger.log({
    //   message: 'Widget has registered with EventBus',
    //   widgetId: widgetId,
    // });

    registeredWidgets.add(widgetId);
  }

  const subscribe = initSubscribeToEventBus(widgetId);

  return {
    publish: initPublishToEventBus(widgetId),
    subscribe,
    // a hook wrapper around subscribe that handles React lifecycle
    useSubscribe: initUseSubscribe(subscribe),
  };
};
