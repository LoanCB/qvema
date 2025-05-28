import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@src/user/dtos/create-user.dto';
import { User } from '@src/user/entities/user.entity';
import { UserNotFoundException } from '@src/user/helpers/user.exception';
import { UserService } from '@src/user/services/user.service';
import { Role } from '@src/user/types/role.types';
import { RegisterDto } from '../dtos/register.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
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

  async getProfile(userId: string): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException({ id: userId });
    }
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException({ id: userId });
    }

    // Handle password update
    if (updateProfileDto.password) {
      if (!updateProfileDto.confirmPassword) {
        throw new BadRequestException('Confirm password is required when updating password');
      }
      if (updateProfileDto.password !== updateProfileDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      // Hash the password before updating
      updateProfileDto.password = Password.hash(updateProfileDto.password);
    } else if (updateProfileDto.confirmPassword) {
      throw new BadRequestException('Password is required when confirming password');
    }

    // Remove confirmPassword from the DTO before passing to user service
    const { confirmPassword, ...updateData } = updateProfileDto;
    return await this.userService.update(userId, updateData);
  }
}
