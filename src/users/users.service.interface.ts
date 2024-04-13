import { User as UserModel } from '@prisma/client';
import { IUserRegisterDto } from './dto/user-register.dto.interface';
import { IUserLoginDto } from './dto/user-login.dto.interface';

export interface IUsersService {
  createUser: (user: IUserRegisterDto) => Promise<UserModel | null>;
  findUser: (email: string) => Promise<UserModel | null>;
  getUserByCredentials: (user: IUserLoginDto) => Promise<UserModel | null>;
  signJWT: (user: UserModel, secret: string) => Promise<string>;
}
