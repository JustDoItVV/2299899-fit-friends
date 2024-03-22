import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { TrainingRequestController } from './training-request.controller';
import { TrainingRequestRepository } from './training-request.repository';
import { TrainingRequestService } from './training-request.service';

@Module({
  imports: [
    PrismaClientModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [
    TrainingRequestController,
  ],
  providers: [
    TrainingRequestRepository,
    TrainingRequestService,
  ],
})
export class TrainingRequestModule {}
