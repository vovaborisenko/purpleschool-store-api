import { Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IControllerRoute } from './route.interface';
import { ILoggerService } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(@inject(TYPES.ILoggerService) protected logger: ILoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): Response<T, Record<string, unknown>> {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): Response<T, Record<string, unknown>> {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response): Response<unknown, Record<string, unknown>> {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const { func, middlewares = [], method, path } of routes) {
      const handler = func.bind(this);
      const bindedMiddlewares = middlewares.map((m) => m.execute.bind(m));

      this.logger.log(`${[method]} ${path}`);
      this.router[method](path, [...bindedMiddlewares, handler]);
    }
  }
}
