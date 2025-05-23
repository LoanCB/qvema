import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from '@src/config/helpers/api-config.config';
import { ApiConfigService } from '@src/config/service/api-config.service';
import { UserModule } from '@src/user/user.module';
import { JwtStrategy } from './helpers/jwt.strategy';
import { AuthService } from './services/auth.service';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: configService.get('jwt.secret'),
      signOptions: { expiresIn: configService.get('jwt.duration') },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
