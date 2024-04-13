import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string = '') {}

  execute(req: Request, res: Response, next: NextFunction): void {
    if (!req.headers.authorization) {
      next();
      return;
    }

    const [, jwt] = req.headers.authorization.split(' ');

    verify(jwt, this.secret, (_error, payload) => {
      if (payload && typeof payload !== 'string') {
        req.user = {
          email: payload.email,
          role: payload.role,
        };
      }

      next();
    });
  }
}
