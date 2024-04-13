import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
    this.client = new PrismaClient();
  }

  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[PrismaService] успешное подключение к базе данных');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('[PrismaService] ошибка подключения к базе данных' + error.message);
      }
    }
  }

  public disconnect(): Promise<void> {
    return this.client.$disconnect();
  }
}
