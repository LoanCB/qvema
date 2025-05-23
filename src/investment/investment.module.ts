import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@src/project/entities/project.entity';
import { User } from '@src/user/entities/user.entity';
import { InvestmentController } from './controllers/investment.controller';
import { Investment } from './entities/investment.entity';
import { InvestmentService } from './services/investment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, Project, User])],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
