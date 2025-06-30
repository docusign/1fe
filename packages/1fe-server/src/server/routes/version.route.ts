import { Router } from 'express';

import { ONEFE_ROUTES } from '../constants';
import VersionController from '../controllers/version.controller';
import { RoutesInterface } from '../types';

class VersionRoute implements RoutesInterface {
  public path = ONEFE_ROUTES.VERSION;

  public router: ReturnType<typeof Router> = Router();

  public widgetVersion = `${this.path}/:org/:widgetId/:version`;

  public widgetBundle = `${this.widgetVersion}/bundle`;

  public widgetBadge = `${this.widgetVersion}/badge`;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, VersionController.index);

    this.router.get(this.widgetVersion, VersionController.widgetVersion);

    this.router.get(this.widgetBundle, VersionController.widgetBundle);

    this.router.get(this.widgetBadge, VersionController.widgetBadge);
  }
}

export default VersionRoute;
