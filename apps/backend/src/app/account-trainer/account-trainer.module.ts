import { Module } from '@nestjs/common';

import { TrainingModule } from '../training/training.module';
import { UserModule } from '../user/user.module';
import { AccountTrainerController } from './account-trainer.controller';
import { AccountTrainerService } from './account-trainer.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TrainingModule,
    OrderModule,
    UserModule,
  ],
  controllers: [
    AccountTrainerController,
  ],
  providers: [
    AccountTrainerService,
  ],
})
export class AccountTrainerModule {}
