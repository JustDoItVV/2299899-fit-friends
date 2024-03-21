import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    PrismaClientModule,
  ],
  controllers: [
    NotificationController,
  ],
  providers: [
    NotificationRepository,
    NotificationService,
  ],
  exports: [
    NotificationService,
  ],
})
export class NotificationModule {}
