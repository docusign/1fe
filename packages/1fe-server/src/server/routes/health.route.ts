import { Router } from 'express';

import HealthController from '../controllers/health.controller';
import { ONEFE_ROUTES } from '../constants';
import { RoutesInterface } from '../types';

class HealthRoute implements RoutesInterface {
  public path = ONEFE_ROUTES.HEALTH;

  public router: ReturnType<typeof Router> = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, HealthController.health());
  }
}

export default HealthRoute;
