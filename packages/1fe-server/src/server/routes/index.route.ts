import { Router } from 'express';

import IndexController from '../controllers/index.controller';
import { ROUTES } from '../constants';
import { RoutesInterface } from '../types';

class IndexRoute implements RoutesInterface {
  public path = ROUTES.INDEX;

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, IndexController.index);
    this.router.post(`${this.path}`, IndexController.index);
  }
}

export default IndexRoute;
