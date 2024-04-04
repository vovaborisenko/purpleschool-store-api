import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';

export interface IUsersController extends BaseController {
  login: (req: Request, res: Response, next: NextFunction) => void;
  resister: (req: Request, res: Response, next: NextFunction) => void;
  info: (req: Request, res: Response, next: NextFunction) => void;
}
