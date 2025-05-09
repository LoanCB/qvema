import { ApiConfigModule } from '@config/api-config.module';
import configuration from '@config/helpers/api-config.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './orm/data-source';
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
  ],
})
export class AppModule {}
