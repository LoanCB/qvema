import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/auth/decorators/role.decorator';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { SwaggerFailureResponse } from '@src/common/helpers/common-set-decorators.helper';
import { Resources } from '@src/common/types/resource.types';
import { UpdateUserInterestsDto } from '@src/interest/dtos/update-user-interests.dto';
import { Interest } from '@src/interest/entities/interest.entity';
import { InterestService } from '@src/interest/services/interest.service';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Role } from '../types/role.types';

@ApiTags(Resources.USER)
@SwaggerFailureResponse()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller({ path: 'users', version: ['1'] })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly interestService: InterestService,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteOne(id);
  }

  @Roles(Role.ADMIN)
  @Get('interests')
  getUserInterests(@GetUser() user: User): Promise<Interest[]> {
    return this.interestService.getUserInterests(user.id);
  }

  @Roles(Role.ADMIN)
  @Post('interests')
  updateUserInterests(@GetUser() user: User, @Body() updateUserInterestsDto: UpdateUserInterestsDto): Promise<User> {
    return this.interestService.updateUserInterests(user.id, updateUserInterestsDto.interestIds);
  }
}
