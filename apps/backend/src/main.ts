/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BackendConfig } from '@2299899-fit-friends/config';
import { BACKEND_GLOBAL_PREFIX } from '@2299899-fit-friends/consts';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix(BACKEND_GLOBAL_PREFIX);

  app.useGlobalPipes(new ValidationPipe());

  const host = BackendConfig().host;
  const port = BackendConfig().appPort;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://${host}:${port}/${BACKEND_GLOBAL_PREFIX}`);
}

bootstrap();
