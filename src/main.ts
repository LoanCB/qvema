import { ApiConfigService } from '@config/service/api-config.service';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const logger = new Logger('QVEMA');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const configService = app.get(ApiConfigService);

  const PORT = configService.get('port');
  const APP_URL = configService.get('app_url');
  const APP_ROUTE_PREFIX = 'api';

  app.setGlobalPrefix(APP_ROUTE_PREFIX);
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(PORT, () => logger.log(`🚀 Qvema is running on: ${APP_URL}/${APP_ROUTE_PREFIX}`));
}

void bootstrap();
