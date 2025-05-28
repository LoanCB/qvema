import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@src/auth/decorators/role.decorator';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/user/types/role.types';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { Investment } from '../entities/investment.entity';
import { InvestmentService } from '../services/investment.service';

@Controller({ path: 'investments', version: ['1'] })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @Roles(Role.INVESTOR)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @GetUser() user: User): Promise<Investment> {
    return this.investmentService.create(createInvestmentDto, user.id);
  }

  @Get()
  @Roles(Role.INVESTOR)
  findInvestorInvestments(@GetUser() user: User): Promise<Investment[]> {
    return this.investmentService.findInvestorInvestments(user.id);
  }

  @Get('project/:id')
  findProjectInvestments(@Param('id', ParseIntPipe) projectId: number, @GetUser() user: User): Promise<Investment[]> {
    return this.investmentService.findProjectInvestments(projectId, user.id);
  }

  @Delete(':id')
  @Roles(Role.INVESTOR)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.investmentService.remove(id, user.id);
  }
}
