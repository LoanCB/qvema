import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as DbUser } from '@src/user/entities/user.entity';
import {
  AuthNoTokenException,
  AuthUnknownException,
  InvalidBearerTokenException,
  TokenExpiredTokenException,
} from '../helpers/auth.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User extends DbUser>(_: Error | null, user: User | false, info?: Error) {
    if (user) return user;

    if (info?.name === 'JsonWebTokenError') throw new InvalidBearerTokenException();
    if (info?.name === 'TokenExpiredError') throw new TokenExpiredTokenException();
    if (info?.name === 'Error') throw new AuthNoTokenException();

    throw new AuthUnknownException();
  }
}
