import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import { TYPES } from './types';
import { ILoggerService } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IPrismaService } from './database/prisma.service.interface';
import { IUsersController } from './users/users.controller.interface';
import { IConfigService } from './config/config.service.interface';
import { AuthMiddleware } from './middlewares/auth.middleware';
import 'reflect-metadata';

@injectable()
export class App {
  app: Express;
  server?: Server;
  port: number;

  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.IConfigService) private config: IConfigService,
    @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.IPrismaService) private prismaService: IPrismaService,
    @inject(TYPES.IUsersController) private usersController: IUsersController,
  ) {
    this.app = express();
    this.port = 8000;
  }

  private useMiddlewares(): void {
    const authMiddleware = new AuthMiddleware(this.config.get('SECRET'));

    this.app.use(json());
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  private useRoutes(): void {
    this.app.use('/users', this.usersController.router);
  }

  private useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init(): Promise<void> {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();

    await this.prismaService.connect();

    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
  }

  public close(): void {
    this.server?.close();
    this.prismaService.disconnect();
  }
}
