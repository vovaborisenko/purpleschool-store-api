import { Role } from '@prisma/client';

export interface IUserRegisterDto {
  email: string;
  password: string;
  name: string;
  role: Role;
}
