import Emittery from 'emittery';

import { ONE_FE_SHELL_ID } from '../../../../constants/event-bus';
import { readMagicBoxShellConfigs } from '../../../../configs/shell-configs';

// const logger = getShellLogger();

const IS_PROD = readMagicBoxShellConfigs().mode === 'production';

export const emitteryInstance: Emittery = new Emittery({
  debug: {
    name: `${ONE_FE_SHELL_ID}_EVENT_BUS:EMITTERY`,
    enabled: !IS_PROD,
    logger: (type, debugName, eventName, eventData) => {
      // TODO: What do we do aboutr debug logger here?
      // const parsedEventData =
      //   typeof eventData === 'object' ? JSON.stringify(eventData) : eventData;

      // const parsedEventName =
      //   typeof eventName === 'symbol' || typeof eventName === 'number'
      //     ? eventName.toString()
      //     : eventName;

      // const currentTime = new Date();

      // const time = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`;

      // logger.log({
      //   time,
      //   debugName,
      //   eventName: parsedEventName,
      //   eventData: parsedEventData,
      //   message: `[EVENT_BUS] Type: ${type}`,
      // });
    },
  },
});
