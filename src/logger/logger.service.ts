import { Logger, ILogObj } from 'tslog';
import { injectable } from 'inversify';
import { ILoggerService } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILoggerService {
  private logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      prettyLogTemplate: '{{dateIsoStr}} {{logLevelName}} ',
    });
  }

  public log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  public warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }

  public error(...args: unknown[]): void {
    this.logger.error(...args);
  }
}
