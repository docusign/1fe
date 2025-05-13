import Emittery from 'emittery';

import { ONE_FE_SHELL_ID } from '../../../../constants/event-bus';
import { getShellLogger } from '../../../../utils/telemetry';
import { ENVIRONMENT_CONFIG } from '../../../../configs/config-helpers';

let emitteryInstance: Emittery;

export const getEmitteryInstance = (): Emittery => {
  if (emitteryInstance) {
    return emitteryInstance;
  }

  emitteryInstance = new Emittery({
    debug: {
      name: `${ONE_FE_SHELL_ID}_EVENT_BUS:EMITTERY`,
      enabled: ENVIRONMENT_CONFIG.mode === 'production',
      logger: (type, debugName, eventName, eventData) => {
        const logger = getShellLogger();

        const parsedEventData =
          typeof eventData === 'object' ? JSON.stringify(eventData) : eventData;

        const parsedEventName =
          typeof eventName === 'symbol' || typeof eventName === 'number'
            ? eventName.toString()
            : eventName;

        const currentTime = new Date();

        const time = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`;

        logger.log({
          time,
          debugName,
          eventName: parsedEventName,
          eventData: parsedEventData,
          message: `[EVENT_BUS] Type: ${type}`,
        });
      },
    },
  });

  return emitteryInstance;
};
