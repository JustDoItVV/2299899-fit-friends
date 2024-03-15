/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BackendConfig } from '@2299899-fit-friends/config';
import { BACKEND_GLOBAL_PREFIX } from '@2299899-fit-friends/consts';
import { LoggingErrorsInterceptor } from '@2299899-fit-friends/core';
import { BackendLoggerService } from '@2299899-fit-friends/logger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix(BACKEND_GLOBAL_PREFIX);

  const specificationConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Fit Friends REST API "Backend" service')
    .setDescription('Fit Friends REST API "Backend" service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, specificationConfig);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingErrorsInterceptor(new BackendLoggerService()));

  const host = BackendConfig().host;
  const port = BackendConfig().appPort;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://${host}:${port}/${BACKEND_GLOBAL_PREFIX}`);
}

bootstrap();
