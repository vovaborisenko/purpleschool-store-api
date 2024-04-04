import { compare } from 'bcryptjs';
import { User as UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUserRegisterDto } from './dto/user-register.dto.interface';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import 'reflect-metadata';
import { IUsersRepository } from './users.repository.interface';
import { IUserLoginDto } from './dto/user-login.dto.interface';
import { sign } from 'jsonwebtoken';

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(TYPES.IConfigService) private config: IConfigService,
    @inject(TYPES.IUsersRepository) private userRepository: IUsersRepository,
  ) {}

  public async createUser({
    email,
    name,
    password,
    role,
  }: IUserRegisterDto): Promise<UserModel | null> {
    if (await this.userRepository.find(email)) {
      return null;
    }

    const newUser = new User(email, name, role);
    const salt = this.config.get('SALT');

    await newUser.setPassword(password, Number(salt));

    return this.userRepository.create(newUser);
  }

  public async findUser(email: string): Promise<UserModel | null> {
    return this.userRepository.find(email);
  }

  public async getUserByCredentials({ email, password }: IUserLoginDto): Promise<UserModel | null> {
    const existedUser = await this.userRepository.find(email);

    if (!existedUser) {
      return null;
    }

    const isValidPassword = await compare(password, existedUser.password);

    return isValidPassword ? existedUser : null;
  }

  public signJWT(user: UserModel, secret: string = ''): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        {
          email: user.email,
          role: user.role,
          ait: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (error, token) => {
          if (token) {
            resolve(token);
          }

          reject(error);
        },
      );
    });
  }
}
