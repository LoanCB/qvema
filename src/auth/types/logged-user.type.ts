import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/user/types/role.types';

export interface UserWithRole extends Pick<User, 'id' | 'firstName' | 'lastName' | 'email'> {
  role: {
    id: number;
    name: string;
    type: Role;
  };
}

export type LoggedUser = Omit<User, 'password'>;

export interface LoggedUserWithToken {
  accessToken: string;
  user: LoggedUser;
}
