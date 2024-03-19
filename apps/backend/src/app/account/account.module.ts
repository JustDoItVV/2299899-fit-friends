import { Module } from '@nestjs/common';

import { TrainingModule } from '../training/training.module';
import { AccountTrainerController } from './account-trainer.controller';
import { AccountUserController } from './account-user.controller';

@Module({
  imports: [
    TrainingModule,
  ],
  controllers: [
    AccountTrainerController,
    AccountUserController,
  ],
})
export class AccountModule {}
