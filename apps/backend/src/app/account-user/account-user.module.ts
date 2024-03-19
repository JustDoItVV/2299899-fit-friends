import { Module } from '@nestjs/common';

import { TrainingModule } from '../training/training.module';
import { AccountUserController } from './account-user.controller';

@Module({
  imports: [
    TrainingModule,
  ],
  controllers: [
    AccountUserController,
  ],
})
export class AccountUserModule {}
