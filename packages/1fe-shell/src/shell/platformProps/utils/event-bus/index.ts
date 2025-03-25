import { EventBusPlatformUtils } from './types';
import { initPublishToEventBus } from './publish';
import { initSubscribeToEventBus } from './subscribe';
import { initUseSubscribe } from './use-subscribe';
import { getShellLogger } from '../../../utils/telemetry';

export const registeredWidgets: Set<string> = new Set();

export const initEventBus = (widgetId: string): EventBusPlatformUtils => {
  if (!registeredWidgets.has(widgetId)) {
    const logger = getShellLogger();

    logger.log({
      message: 'Widget has registered with EventBus',
      widgetId: widgetId,
    });

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
