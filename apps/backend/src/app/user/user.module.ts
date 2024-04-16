import { JwtAccessStrategy } from '@2299899-fit-friends/backend-core';
import { BackendConfigModule, getJwtOptions } from '@2299899-fit-friends/config';
import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { NotificationModule } from '../notification/notification.module';
import { UploaderModule } from '../uploader/uploader.module';
import { JwtRefreshStrategy } from './refresh-token/jwt-refresh.strategy';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaClientModule,
    RefreshTokenModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    BackendConfigModule,
    UploaderModule,
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
