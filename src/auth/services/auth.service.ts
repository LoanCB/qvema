import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { UserNotFoundException } from '@src/user/helpers/user.exception';
import { UserService } from '@src/user/services/user.service';
import { Role } from '@src/user/types/role.types';
import { RegisterDto } from '../dtos/register.dto';
import { InvalidCredentialsException } from '../helpers/auth.exception';
import { Password } from '../helpers/password.utils';
import { LoggedUserWithToken } from '../types/logged-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async singIn(email: string, password: string): Promise<LoggedUserWithToken> {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (user && Password.compare(password, user.password)) {
      const payload = { userId: user.id, username: user.email };
      const { password: _, ...returnUser } = user;
      return {
        accessToken: this.jwtService.sign(payload),
        user: returnUser,
      };
    }

    throw new InvalidCredentialsException();
  }

  async register(registerDto: RegisterDto): Promise<LoggedUserWithToken> {
    // Ensure role is set to CUSTOMER
    const createUserDto: CreateUserDto = {
      ...registerDto,
      role: Role.INVESTOR,
    };

    // Create the user
    await this.userService.create(createUserDto);

    // Get the created user with all fields
    const user = await this.userService.findOneByEmailWithPassword(createUserDto.email);
    if (!user) {
      throw new UserNotFoundException({ email: registerDto.email });
    }

    const payload = { userId: user.id, username: user.email };
    const { password: _, ...returnUser } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: returnUser,
    };
  }
}
