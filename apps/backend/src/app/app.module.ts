import { BackendConfigModule } from '@2299899-fit-friends/config';
import { Module } from '@nestjs/common';

import { AccountTrainerModule } from './account-trainer/account-trainer.module';
import { AccountUserModule } from './account-user/account-user.module';
import { ReviewModule } from './review/review.module';
import { TrainingModule } from './training/training.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    BackendConfigModule,
    UserModule,
    TrainingModule,
    ReviewModule,
    AccountTrainerModule,
    AccountUserModule,
  ],
})
export class AppModule {}
