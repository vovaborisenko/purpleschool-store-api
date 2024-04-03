import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { ILoggerService } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      this.logger.error(`[${err.context}] ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ message: err.message });
    } else {
      this.logger.error(err.message);
      res.status(500).send({ message: err.message });
    }
  }
}
