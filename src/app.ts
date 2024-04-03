import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import { TYPES } from './types';
import { ILoggerService } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IPrismaService } from './database/prisma.service.interface';
import 'reflect-metadata';

@injectable()
export class App {
  app: Express;
  server: Server | undefined;
  port: number;

  constructor(
    @inject(TYPES.ILoggerService) private logger: ILoggerService,
    @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.IPrismaService) private prismaService: IPrismaService,
  ) {
    this.app = express();
    this.port = 8000;
  }

  private useMiddlewares(): void {
    this.app.use(json());
  }

  private useRoutes(): void {}

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
