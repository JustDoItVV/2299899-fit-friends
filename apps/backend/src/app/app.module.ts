import { BackendConfigModule } from '@2299899-fit-friends/config';
import { Module } from '@nestjs/common';

import { ReviewModule } from './review/review.module';
import { TrainingModule } from './training/training.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    BackendConfigModule,
    UserModule,
    TrainingModule,
    ReviewModule,
  ],
})
export class AppModule {}
