import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { InterestController } from './controllers/interest.controller';
import { Interest } from './entities/interest.entity';
import { InterestService } from './services/interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interest, User])],
  controllers: [InterestController],
  providers: [InterestService],
  exports: [InterestService],
})
export class InterestModule {}
