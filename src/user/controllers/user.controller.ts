import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { UpdateUserInterestsDto } from '@src/interest/dtos/update-user-interests.dto';
import { Interest } from '@src/interest/entities/interest.entity';
import { InterestService } from '@src/interest/services/interest.service';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller({ path: 'users', version: ['1'] })
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly interestService: InterestService,
  ) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteOne(id);
  }

  @Get('interests')
  getUserInterests(@GetUser() user: User): Promise<Interest[]> {
    return this.interestService.getUserInterests(user.id);
  }

  @Post('interests')
  updateUserInterests(@GetUser() user: User, @Body() updateUserInterestsDto: UpdateUserInterestsDto): Promise<User> {
    return this.interestService.updateUserInterests(user.id, updateUserInterestsDto.interestIds);
  }
}
