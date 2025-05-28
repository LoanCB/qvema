import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@src/orm/data-source';
import { User } from '@src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TypeOrmModule.forFeature([User])],
})
export class CliModule {}
