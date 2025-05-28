import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@src/auth/decorators/role.decorator';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { LoggedUser } from '@src/auth/types/logged-user.type';
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
  create(@Body() createInvestmentDto: CreateInvestmentDto, @GetUser() user: LoggedUser): Promise<Investment> {
    return this.investmentService.create(createInvestmentDto, user.id);
  }

  @Get()
  @Roles(Role.INVESTOR)
  findInvestorInvestments(@GetUser() user: LoggedUser): Promise<Investment[]> {
    return this.investmentService.findInvestorInvestments(user.id);
  }

  @Get('project/:id')
  findProjectInvestments(@Param('id') projectId: string, @GetUser() user: LoggedUser): Promise<Investment[]> {
    return this.investmentService.findProjectInvestments(projectId, user.id);
  }

  @Delete(':id')
  @Roles(Role.INVESTOR)
  remove(@Param('id') id: string, @GetUser() user: LoggedUser): Promise<void> {
    return this.investmentService.remove(id, user.id);
  }
}
