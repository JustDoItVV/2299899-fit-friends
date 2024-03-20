import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { MailNotificationRepository } from './mail-notification.repository';

@Module({
  imports: [
    PrismaClientModule,
  ],
  providers: [
    MailNotificationRepository,
  ],
  exports: [
    MailNotificationRepository,
  ],
})
export class MailNotificationModule {}
