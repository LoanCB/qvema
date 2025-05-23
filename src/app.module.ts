import { ApiConfigModule } from '@config/api-config.module';
import configuration from '@config/helpers/api-config.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InterestModule } from './interest/interest.module';
import { InvestmentModule } from './investment/investment.module';
import { dataSourceOptions } from './orm/data-source';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ApiConfigModule,
    UserModule,
    AuthModule,
    ProjectModule,
    InterestModule,
    InvestmentModule,
  ],
})
export class AppModule {}
