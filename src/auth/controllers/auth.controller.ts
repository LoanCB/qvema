import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@src/user/entities/user.entity';
import { GetUser } from '../decorators/user.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LoggedUser, LoggedUserWithToken } from '../types/logged-user.type';
import { AuthService } from './../services/auth.service';

@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<LoggedUserWithToken> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto): Promise<LoggedUserWithToken> {
    return this.authService.singIn(signInDto.email, signInDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@GetUser() user: LoggedUser): Promise<User> {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile')
  updateProfile(@GetUser() user: LoggedUser, @Body() updateProfileDto: UpdateProfileDto): Promise<User> {
    return this.authService.updateProfile(user.id, updateProfileDto);
  }
}
