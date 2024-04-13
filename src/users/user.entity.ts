import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';

export class User {
  private _password: string = '';

  constructor(
    private _email: string,
    private _name?: string,
    private _role?: Role,
  ) {}

  get name(): string | undefined {
    return this._name;
  }

  get role(): Role {
    return this._role || Role.User;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  async setPassword(password: string, salt: string | number = 5): Promise<void> {
    this._password = await hash(password, salt);
  }
}
