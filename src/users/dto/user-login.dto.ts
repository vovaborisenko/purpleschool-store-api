import { Length, IsEmail } from 'class-validator';
import { IUserLoginDto } from './user-login.dto.interface';

export class UserLoginDto implements IUserLoginDto {
  @IsEmail()
  email!: string;

  @Length(6, 125)
  password!: string;
}
