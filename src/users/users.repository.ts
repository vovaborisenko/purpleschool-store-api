import { User as UserModel } from '@prisma/client';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IPrismaService } from '../database/prisma.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@inject(TYPES.IPrismaService) private prismaService: IPrismaService) {}

  public create({ email, name, password, role }: User): Promise<UserModel> {
    return this.prismaService.client.user.create({
      data: {
        email,
        name,
        password,
        role,
      },
    });
  }

  public find(email: string): Promise<UserModel | null> {
    return this.prismaService.client.user.findFirst({
      where: { email },
    });
  }
}
