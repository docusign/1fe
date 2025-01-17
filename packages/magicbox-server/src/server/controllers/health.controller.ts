import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { WidgetConfig } from '../types';
import { getWidgetConfigValues } from '../utils';
import { getCachedWidgetConfigs } from '../utils';

/*
  TODO:
  - Implement getCachedWidgetConfigs + getWidgetConfigValues 
*/

const validateWidgetConfig = (widgetConfig: WidgetConfig): boolean => {
  switch (true as boolean) {
    case typeof widgetConfig !== 'object':
    case isEmpty(widgetConfig):
    case typeof widgetConfig.runtime !== 'object':
      return false;
  }

  return true;
};

class HealthController {
  public static health =
    () =>
    (_: Request, res: Response, next: NextFunction): void => {
      try {
        const widgetConfigs = getCachedWidgetConfigs();

        const allWidgetConfigsAreValid =
          widgetConfigs.size > 0 &&
          getWidgetConfigValues(widgetConfigs).every(validateWidgetConfig);

        res.setHeader('content-type', 'text/plain');

        if (allWidgetConfigsAreValid) {
          res.status(200);
          res.send('Healthy');
        } else {
          res.status(500);
          res.send('Not Healthy');
        }
      } catch (error) {
        next(error);
      }
    };
}

export default HealthController;
