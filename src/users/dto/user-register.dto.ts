import { Role } from '@prisma/client';
import { IsEmail, IsIn, IsString, Length } from 'class-validator';
import { IUserRegisterDto } from './user-register.dto.interface';

export class UserRegisterDto implements IUserRegisterDto {
  @IsEmail()
  email!: string;

  @Length(6, 125)
  password!: string;

  @IsString()
  name!: string;

  @IsIn(Object.values(Role))
  role!: Role;
}
