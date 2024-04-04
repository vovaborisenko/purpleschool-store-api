import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IControllerRoute } from '../common/route.interface';
import { HTTPError } from '../errors/http-error.class';
import { ILoggerService } from '../logger/logger.interface';
import { UsersService } from './users.service';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { IConfigService } from '../config/config.service.interface';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUsersController {
  private routes: IControllerRoute[] = [
    {
      path: '/sign-in',
      method: 'post',
      func: this.login,
      middlewares: [new ValidateMiddleware(UserLoginDto)],
    },
    {
      path: '/sign-up',
      method: 'post',
      func: this.resister,
      middlewares: [new ValidateMiddleware(UserRegisterDto)],
    },
    {
      path: '/info',
      method: 'get',
      func: this.info,
      middlewares: [new GuardMiddleware()],
    },
  ];

  constructor(
    @inject(TYPES.ILoggerService) logger: ILoggerService,
    @inject(TYPES.IConfigService) private config: IConfigService,
    @inject(TYPES.IUsersService) private usersService: UsersService,
  ) {
    super(logger);
    this.bindRoutes(this.routes);
  }

  public async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const user = await this.usersService.getUserByCredentials(body);

    if (!user) {
      return next(new HTTPError(401, 'Ошибка авторизации', 'login'));
    }

    const jwt = await this.usersService.signJWT(user, this.config.get('SECRET'));

    this.ok(res, { jwt });
  }

  public async resister(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'Пользователь с таким email уже существует', 'register'));
    }

    this.ok(res, result);
  }

  public async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    if (!user) {
      return next(new HTTPError(404, 'Пользователя не существует', 'info'));
    }

    const executedUser = await this.usersService.findUser(user.email);

    this.ok(res, { id: executedUser?.id, email: executedUser?.email });
  }
}
