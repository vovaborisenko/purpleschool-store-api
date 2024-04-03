import { ContainerModule, interfaces } from 'inversify';
import { ILoggerService } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { App } from './app';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ExceptionFilter } from './errors/exception.filter';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();

  bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);

  bind<App>(TYPES.Application).to(App);
});

export { appBindings };
