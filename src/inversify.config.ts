import { ContainerModule, interfaces } from 'inversify';
import { ILoggerService } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { App } from './app';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IPrismaService } from './database/prisma.service.interface';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
  bind<IPrismaService>(TYPES.IPrismaService).to(PrismaService).inSingletonScope();

  bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
  bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository);
  bind<IUsersService>(TYPES.IUsersService).to(UsersService);
  bind<IUsersController>(TYPES.IUsersController).to(UsersController);

  bind<App>(TYPES.Application).to(App);
});

export { appBindings };
