import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { MailNotificationModule } from '../mail-notification/mail-notification.module';
import { UploaderModule } from '../uploader/uploader.module';
import { UserModule } from '../user/user.module';
import { TrainingController } from './training.controller';
import { TrainingRepository } from './training.repository';
import { TrainingService } from './training.service';

@Module({
  imports: [
    PrismaClientModule,
    UploaderModule,
    MailNotificationModule,
    UserModule,
  ],
  controllers: [
    TrainingController,
  ],
  providers: [
    TrainingRepository,
    TrainingService,
  ],
  exports: [
    TrainingRepository,
    TrainingService,
  ],
})
export class TrainingModule {}
