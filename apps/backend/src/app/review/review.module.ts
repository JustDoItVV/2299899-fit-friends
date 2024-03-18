import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { TrainingModule } from '../training/training.module';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [
    PrismaClientModule,
    TrainingModule,
  ],
  controllers: [
    ReviewController,
  ],
  providers: [
    ReviewRepository,
    ReviewService
  ],
})
export class ReviewModule {}
