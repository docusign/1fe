import { Router } from 'express';

import HealthController from '../controllers/health.controller';
import { ROUTES } from '../constants';
import { RoutesInterface } from '../types';

class HealthRoute implements RoutesInterface {
  public path = ROUTES.HEALTH;

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, HealthController.health());
  }
}

export default HealthRoute;
