import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { Interest } from '../entities/interest.entity';
import { InterestService } from '../services/interest.service';

@Controller({ path: 'interests', version: ['1'] })
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Get()
  findAll(): Promise<Interest[]> {
    return this.interestService.findAll();
  }
}
