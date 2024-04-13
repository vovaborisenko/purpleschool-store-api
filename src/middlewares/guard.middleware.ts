import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { HTTPError } from '../errors/http-error.class';

export class GuardMiddleware implements IMiddleware {
  execute({ user }: Request, res: Response, next: NextFunction): void {
    if (!user) {
      return next(new HTTPError(401, 'Unauthorized', 'guard'));
    }

    next();
  }
}
