import { SwaggerConfig } from '@config/helpers/swagger.config';
import { ApiConfigService } from '@config/service/api-config.service';
import { Logger, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { InvalidDtoException } from './common/helpers/error-codes/custom.exception';
import { buildErrors } from './common/helpers/error-codes/validation-error.helper';

const logger = new Logger('QVEMA');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const configService = app.get(ApiConfigService);

  const PORT = configService.get('port');
  const APP_URL = configService.get('app_url');
  const APP_ROUTE_PREFIX = 'api';

  app.setGlobalPrefix(APP_ROUTE_PREFIX);
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new InvalidDtoException(buildErrors(validationErrors));
      },
    }),
  );
  app.enableCors();

  SwaggerConfig(app, configService.get('api_version'));

  await app.listen(PORT, () => logger.log(`🚀 Qvema is running on: ${APP_URL}/${APP_ROUTE_PREFIX}`));
}

void bootstrap();
