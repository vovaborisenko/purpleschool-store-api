import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput | undefined;

  constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
    const { error, parsed } = config();

    if (error) {
      this.logger.warn('[ConfigService] Ошибка загрузки .env');
    } else if (parsed) {
      this.logger.log('[ConfigService] Загружен .env');
      this.config = parsed;
    }
  }

  get(key: string): string | undefined {
    return this.config?.[key];
  }
}
